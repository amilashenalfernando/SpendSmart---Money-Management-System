import { PrismaClient, Type, Category } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('demo1234', 10)
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@spendsmart.com' },
    update: {},
    create: {
      email: 'demo@spendsmart.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  })

  // Clear existing transactions for demo user to avoid duplicates if run multiple times
  await prisma.transaction.deleteMany({
    where: { userId: demoUser.id }
  })

  const transactions = []
  const now = new Date()
  
  // Generate 3 months of data
  for (let i = 0; i < 90; i++) {
    const d = new Date()
    d.setDate(now.getDate() - i)
    
    // Add 1-3 transactions per day randomly
    const txCount = Math.floor(Math.random() * 3) + 1
    
    for (let j = 0; j < txCount; j++) {
      const isIncome = Math.random() > 0.8 // 20% chance of income
      
      if (isIncome) {
        transactions.push({
          userId: demoUser.id,
          title: 'Salary / Freelance',
          amount: Math.floor(Math.random() * 50000) + 20000,
          type: Type.INCOME,
          category: Category.OTHER,
          date: new Date(d),
        })
      } else {
        const categories = Object.values(Category)
        const cat = categories[Math.floor(Math.random() * categories.length)]
        
        // varied amounts based on category
        let amount = Math.floor(Math.random() * 1000) + 100
        if (cat === Category.FOOD) amount = Math.floor(Math.random() * 1500) + 500
        if (cat === Category.TRANSPORT) amount = Math.floor(Math.random() * 600) + 200
        if (cat === Category.HOUSING) amount = Math.floor(Math.random() * 5000) + 2000
        
        transactions.push({
          userId: demoUser.id,
          title: `Expense at ${(cat as string).toLowerCase()}`,
          amount,
          type: Type.EXPENSE,
          category: cat,
          date: new Date(d),
        })
      }
    }
  }

  await prisma.transaction.createMany({
    data: transactions
  })

  console.log('Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
