/**
 * ============================================
 * Seed Script
 * ============================================
 * Populates the database with starter content:
 * - An admin user and a demo farmer/trader user
 * - Sample knowledge base articles
 * - A self-assessment quiz
 * - A sample marketplace listing
 *
 * Usage: npm run seed
 * ============================================
 */

require('dotenv').config();
const { connectDB, initializeDatabase, closeDatabase } = require('../server/db/database');
const User = require('../server/models/User');
const Article = require('../server/models/Article');
const Quiz = require('../server/models/Quiz');
const Product = require('../server/models/Product');

(async () => {
    try {
        await connectDB();
        await initializeDatabase();
        console.log('\n=== Seeding database ===');

        // 1. Users
        const users = [
            { name: 'KCNP Admin', email: 'admin@kcnpagro.org', password: 'adminpass123', role: 'admin' },
            { name: 'Demo Farmer', email: 'farmer@example.com', password: 'farmer123', role: 'farmer' },
            { name: 'Demo Trader', email: 'trader@example.com', password: 'trader123', role: 'trader' }
        ];
        for (const u of users) {
            const existing = await User.findOne({ email: u.email });
            if (!existing) {
                await User.create(u);
                console.log(`[User] Created ${u.name} (${u.role})`);
            }
        }

        // 2. Articles
        const articleCount = await Article.countDocuments();
        if (articleCount === 0) {
            await Article.create([
                {
                    title: 'Getting Started with Climate Smart Agriculture',
                    category: 'climate-smart-farming',
                    summary: 'An introduction to the three pillars of climate smart agriculture: productivity, adaptation, and mitigation.',
                    content: 'Climate-Smart Agriculture (CSA) is an approach that helps guide actions to transform and reorient agricultural systems to effectively support development and ensure food security under a changing climate. CSA aims to tackle three main objectives: sustainably increasing agricultural productivity and incomes, adapting and building resilience to climate change, and reducing greenhouse gas emissions where possible. For smallholder farmers, simple steps such as diversifying crops, improving soil health with organic matter, mulching to retain moisture, and using drought-tolerant seed varieties can deliver significant benefits with minimal investment.',
                    tags: ['introduction', 'basics'],
                    published: true
                },
                {
                    title: 'Soil Health: The Foundation of Productive Farms',
                    category: 'soil-health',
                    summary: 'Improve yields and resilience by building healthy living soil through composting and crop rotation.',
                    content: 'Healthy soil is the foundation of productive, climate-resilient farming. Soils rich in organic matter hold more water, resist erosion, and support thriving populations of beneficial organisms. Farmers can build soil health through regular additions of compost or manure, minimizing tillage, keeping the ground covered with mulch or cover crops, and rotating crops to break pest and disease cycles. Test your soil periodically to understand its pH and nutrient levels, and adjust amendments accordingly. Healthy soils also store significant amounts of carbon, contributing to global climate change mitigation while improving farm profitability.',
                    tags: ['soil', 'compost', 'crop-rotation'],
                    published: true
                },
                {
                    title: 'Water Conservation Techniques for Dry Regions',
                    category: 'water-management',
                    summary: 'Practical water-saving techniques for farmers facing drought and erratic rainfall.',
                    content: 'Water is becoming an increasingly scarce and unpredictable resource for agriculture. Farmers in dry regions can reduce their dependency on unreliable rainfall through a combination of techniques: capturing rainwater with roof harvesters and contour bunds, using drip irrigation to deliver water directly to plant roots, applying mulch to reduce evaporation, and selecting drought-tolerant crop varieties. Scheduling irrigation during cooler times of day and using soil moisture monitoring can further reduce water use. Every drop saved improves resilience during dry spells and reduces the impact of erratic climate patterns.',
                    tags: ['water', 'drought', 'irrigation'],
                    published: true
                },
                {
                    title: 'Understanding Carbon Credits for Farmers',
                    category: 'carbon-credits',
                    summary: 'How farmers can earn income from practices that capture carbon in soil and vegetation.',
                    content: 'Carbon credit programs allow farmers to earn income by adopting practices that capture atmospheric carbon dioxide. Regenerative practices such as agroforestry, conservation tillage, and cover cropping can qualify farmers to sell verified carbon offsets on voluntary markets. The process typically involves registering a project, measuring baseline emissions, implementing the practices, and undergoing third-party verification. While the verification process requires record-keeping, the additional revenue stream can make climate-smart practices economically attractive and provide extra income to rural households.',
                    tags: ['carbon', 'income', 'agroforestry'],
                    published: true
                }
            ]);
            console.log('[Article] Created 4 articles');
        }

        // 3. Quiz
        const quizCount = await Quiz.countDocuments();
        if (quizCount === 0) {
            await Quiz.create({
                title: 'Climate Smart Basics',
                description: 'Test your understanding of climate-smart agriculture fundamentals.',
                category: 'climate-basics',
                published: true,
                questions: [
                    {
                        question: 'What is Climate-Smart Agriculture (CSA)?',
                        options: [
                            'Farming that ignores climate change',
                            'An approach to increase productivity, adapt to climate change, and reduce emissions',
                            'Indoor hydroponic farming only',
                            'Traditional farming with no changes'
                        ],
                        correctIndex: 1,
                        explanation: 'CSA sustainably increases productivity, adapts to climate change, and mitigates greenhouse gas emissions.'
                    },
                    {
                        question: 'Which practice most directly improves soil health?',
                        options: ['Burning crop residue', 'Continuous monoculture', 'Composting and crop rotation', 'Increasing pesticide use'],
                        correctIndex: 2,
                        explanation: 'Composting and crop rotation add organic matter and break pest and disease cycles.'
                    },
                    {
                        question: 'Which technique is most water-efficient for irrigation?',
                        options: ['Flood irrigation', 'Drip irrigation', 'Sprinkler irrigation during midday', 'Rain-fed only'],
                        correctIndex: 1,
                        explanation: 'Drip irrigation delivers water directly to plant roots, minimizing evaporation losses.'
                    },
                    {
                        question: 'What is a key benefit of agroforestry?',
                        options: [
                            'It increases soil erosion',
                            'It captures carbon and diversifies farmer income',
                            'It requires more synthetic fertilizer',
                            'It reduces biodiversity'
                        ],
                        correctIndex: 1,
                        explanation: 'Agroforestry captures carbon in trees and soil while providing fruit, timber, and shade income.'
                    }
                ]
            });
            console.log('[Quiz] Created "Climate Smart Basics"');
        }

        // 4. Sample product listing
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            await Product.create({
                title: 'Drought-Tolerant Maize Seeds (Katumani)',
                description: 'Quality certified Katumani maize seeds ideal for low-rainfall regions. High-yield and drought tolerant.',
                category: 'seeds',
                price: 12,
                unit: 'kg',
                location: 'Mombasa, Kenya',
                contactEmail: 'farmer@example.com',
                contactPhone: '+254 700 000 000'
            });
            console.log('[Product] Created sample listing');
        }

        console.log('\n=== Seeding complete ===\n');
        console.log('Demo accounts:');
        console.log('Admin  - admin@kcnpagro.org / adminpass123');
        console.log('Farmer - farmer@example.com / farmer123');
        console.log('Trader - trader@example.com / trader123');

        await closeDatabase();
        process.exit(0);
    } catch (err) {
        console.error('[Seed] FAILED:', err.message);
        try { await closeDatabase(); } catch (e) {}
        process.exit(1);
    }
})();