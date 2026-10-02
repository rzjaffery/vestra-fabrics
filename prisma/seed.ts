import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const fabricsData = [
    {
        name: "Egyptian Giza Superfine Cotton",
        slug: "egyptian-giza-superfine-cotton",
        material: "100% Giza Cotton",
        price: 2450,
        stock: 180,
        description: "Ultra-smooth 100s two-ply Giza cotton with a natural soft sheen. Ideal for crisp formal dress shirts and luxury summer kurtas.",
        images: ["https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1000"],
        featured: true,
    },
    {
        name: "Textured Organic Slub Cotton",
        slug: "textured-organic-slub-cotton",
        material: "100% Organic Cotton",
        price: 1850,
        stock: 140,
        description: "Breathable cotton featuring an organic slub texture that adds subtle tactile depth. Perfect for casual kurtas and summer shirts.",
        images: ["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000"],
        featured: true,
    },
    {
        name: "Super 120s Italian Tropical Wool",
        slug: "super-120s-italian-tropical-wool",
        material: "100% Merino Wool",
        price: 5200,
        stock: 60,
        description: "Lightweight, breathable 4-season tropical wool with exceptional drape and crease resistance. Essential for bespoke suits and dress trousers.",
        images: ["https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=1000"],
        featured: true,
    },
    {
        name: "Luxe Wrinkle-Free Wash & Wear",
        slug: "luxe-wrinkle-free-wash-and-wear",
        material: "Micro-Polyester Silk Blend",
        price: 1950,
        stock: 220,
        description: "High-performance wrinkle-free fabric engineered for fluid drape and low maintenance. Designed specifically for traditional menswear.",
        images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000"],
        featured: false,
    },
    {
        name: "Wild Raw Silk & Linen Blend",
        slug: "wild-raw-silk-linen-blend",
        material: "50% Silk / 50% Flax Linen",
        price: 3800,
        stock: 45,
        description: "A structured fabric combining crisp European flax with rich slub texture from wild raw silk. Exceptional for waistcoats and jackets.",
        images: ["https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1000"],
        featured: true,
    },
    {
        name: "Pure Irish Linen",
        slug: "pure-irish-linen",
        material: "100% Irish Flax Linen",
        price: 2950,
        stock: 90,
        description: "Cool, highly absorbent natural linen with a classic crisp handle that softens gracefully over time. Perfect for summer shirts and trousers.",
        images: ["https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000"],
        featured: false,
    },
    {
        name: "Heavyweight Boski Silk",
        slug: "heavyweight-boski-silk",
        material: "100% Spun Silk",
        price: 4800,
        stock: 75,
        description: "Traditional 8-pound Chinese spun Boski silk offering an unrivaled buttery texture, luster, and regal formal drape.",
        images: ["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1000"],
        featured: true,
    },
    {
        name: "Mercerized Pima Cotton Interlock",
        slug: "mercerized-pima-cotton-interlock",
        material: "100% Pima Cotton",
        price: 2100,
        stock: 110,
        description: "Double-knit Pima jersey subjected to mercerization for enhanced luster, color retention, and smooth stretch. Crafted for elevated polos.",
        images: ["https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1000"],
        featured: false,
    },
    {
        name: "Handloom Textured Khaddar",
        slug: "handloom-textured-khaddar",
        material: "100% Hand-spun Cotton",
        price: 1650,
        stock: 130,
        description: "Authentic hand-loomed winter cotton featuring a rich earthy texture that provides insulation and timeless heritage aesthetic.",
        images: ["https://images.unsplash.com/photo-1520006403909-838d6b92c22e?q=80&w=1000"],
        featured: false,
    },
    {
        name: "Micro-Houndstooth Suiting Twill",
        slug: "micro-houndstooth-suiting-twill",
        material: "Wool & Cashmere Blend",
        price: 4400,
        stock: 50,
        description: "Subtle two-tone micro-houndstooth weave woven with fine wool and cashmere yarns for refined blazer tailoring.",
        images: ["https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1000"],
        featured: false,
    }
]

const readyMadeData = [
    {
        name: "Bespoke Cut Cotton Kurta",
        slug: "bespoke-cut-cotton-kurta",
        price: 6800,
        stock: 25,
        sizes: ["S", "M", "L", "XL"],
        description: "A refined men's kurta featuring a sharp band collar, concealed placket, and clean tailored cuffs for a contemporary silhouette.",
        images: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000"],
        featured: true,
    },
    {
        name: "Mercerized Pima Polo",
        slug: "mercerized-pima-polo",
        price: 4200,
        stock: 40,
        sizes: ["S", "M", "L", "XL"],
        description: "Elevated smart-casual polo shirt with a self-fabric structured collar, mother-of-pearl buttons, and a luminous finish.",
        images: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000"],
        featured: true,
    },
    {
        name: "Royal Oxford Dress Shirt",
        slug: "royal-oxford-dress-shirt",
        price: 5400,
        stock: 30,
        sizes: ["15.5", "16.0", "16.5", "17.0"],
        description: "The quintessential formal shirt featuring a semi-spread collar, single-needle precision stitching, and stiff cuffs.",
        images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000"],
        featured: true,
    },
    {
        name: "Pleated Tropical Wool Trouser",
        slug: "pleated-tropical-wool-trouser",
        price: 8500,
        stock: 18,
        sizes: ["30", "32", "34", "36"],
        description: "Classic tailored trousers with a single forward pleat, side waist adjusters, and a clean unhemmed finish for custom tailoring.",
        images: ["https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=1000"],
        featured: true,
    },
    {
        name: "Textured Silk-Linen Waistcoat",
        slug: "textured-silk-linen-waistcoat",
        price: 7900,
        stock: 15,
        sizes: ["S", "M", "L", "XL"],
        description: "A structured men's Nehru waistcoat with a subtle slub weave pattern, horn buttons, and an adjustable back cinch.",
        images: ["https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=1000"],
        featured: true,
    },
    {
        name: "Classic Wash & Wear Shalwar Kameez",
        slug: "classic-wash-and-wear-shalwar-kameez",
        price: 8900,
        stock: 20,
        sizes: ["S", "M", "L", "XL"],
        description: "Traditional 2-piece suite expertly tailored from wrinkle-free microfiber cloth with thread-line detailing on collar.",
        images: ["https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000"],
        featured: false,
    },
    {
        name: "Bespoke Navy Double-Breasted Blazer",
        slug: "bespoke-navy-double-breasted-blazer",
        price: 22000,
        stock: 10,
        sizes: ["38R", "40R", "42R", "44R"],
        description: "A sharp 6-button double-breasted blazer woven from Italian tropical wool, featuring peak lapels and horn buttons.",
        images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000"],
        featured: true,
    },
    {
        name: "Casual Irish Linen Button-Down",
        slug: "casual-irish-linen-button-down",
        price: 4900,
        stock: 35,
        sizes: ["S", "M", "L", "XL"],
        description: "Relaxed resort-collar shirt tailored from pure breathable linen with natural mother-of-pearl buttons.",
        images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000"],
        featured: false,
    },
    {
        name: "Tailored Chino Trousers",
        slug: "tailored-chino-trousers",
        price: 4500,
        stock: 50,
        sizes: ["30", "32", "34", "36"],
        description: "Smart-casual flat-front chinos crafted from stretch cotton twill with welt back pockets and a clean tapered leg.",
        images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000"],
        featured: false,
    },
    {
        name: "Heavyweight Boski Formal Suit",
        slug: "heavyweight-boski-formal-suit",
        price: 18500,
        stock: 12,
        sizes: ["S", "M", "L", "XL"],
        description: "Luxurious 2-piece traditional Eastern suit tailored from genuine 8-pound Boski silk for formal events.",
        images: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000"],
        featured: false,
    }
]

async function main() {
    console.log("Seeding menswear fabrics...")
    for (const fabric of fabricsData) {
        await prisma.fabric.upsert({
            where: { slug: fabric.slug },
            update: fabric,
            create: fabric,
        })
    }

    console.log("Seeding ready-made menswear products...")
    for (const product of readyMadeData) {
        await prisma.readyMadeProduct.upsert({
            where: { slug: product.slug },
            update: product,
            create: product,
        })
    }

    console.log("Seeding complete!")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })