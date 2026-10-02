import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const fabricsData = [
    {
        name: "Royal Mulberry Raw Silk",
        slug: "royal-mulberry-raw-silk",
        material: "Pure Mulberry Silk",
        price: 3500,
        stock: 120,
        description: "Heavyweight, rich textured 100% pure raw silk with a subtle natural sheen.",
        images: ["https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=1000"],
        featured: true,
    },
    {
        name: "Gold Zari Brocade Chiffon",
        slug: "gold-zari-brocade-chiffon",
        material: "Pure Chiffon",
        price: 2800,
        stock: 85,
        description: "Lightweight sheer chiffon with intricate gold foil metallic weave.",
        images: ["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1000"],
        featured: true,
    },
    {
        name: "Embroidered Swiss Voile",
        slug: "embroidered-swiss-voile",
        material: "100% Swiss Cotton",
        price: 1950,
        stock: 45,
        description: "Breathable, ultra-soft Swiss cotton with intricate schiffli floral embroidery.",
        images: ["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000"],
        featured: true,
    },
    {
        name: "Egyptian Giza Cotton Lawn",
        slug: "egyptian-giza-cotton-lawn",
        material: "Giza Cotton",
        price: 1650,
        stock: 200,
        description: "Extra-long staple Egyptian cotton featuring a silky hand feel.",
        images: ["https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1000"],
        featured: false,
    },
    {
        name: "Handwoven Banarsi Jamawar",
        slug: "handwoven-banarsi-jamawar",
        material: "Jamawar Silk",
        price: 4200,
        stock: 30,
        description: "Traditional heritage weave featuring detailed floral brocade motifs.",
        images: ["https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1000"],
        featured: true,
    },
    {
        name: "French Velvet Royale (Emerald)",
        slug: "french-velvet-royale-emerald",
        material: "Micro Velvet 9000",
        price: 3200,
        stock: 95,
        description: "Plush 9000-micro velvet with rich color depth and non-crushing pile.",
        images: ["https://images.unsplash.com/photo-1520006403909-838d6b92c22e?q=80&w=1000"],
        featured: false,
    },
    {
        name: "Textured Metallic Organza",
        slug: "textured-metallic-organza",
        material: "Silk Organza",
        price: 2100,
        stock: 18,
        description: "Crisp, iridescent silk organza infused with metallic lurex threads.",
        images: ["https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1000"],
        featured: false,
    },
    {
        name: "Pima Cotton Satin",
        slug: "pima-cotton-satin-pearl-white",
        material: "Pima Cotton",
        price: 1850,
        stock: 150,
        description: "High thread count cotton with a lustrous satin finish.",
        images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000"],
        featured: false,
    },
    {
        name: "Pure Georgette Crepe",
        slug: "pure-georgette-crepe",
        material: "Pure Crepe",
        price: 2600,
        stock: 110,
        description: "Fluid drape with a pebbled texture. Flawlessly holds dye and embroidery.",
        images: ["https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1000"],
        featured: false,
    },
    {
        name: "Textured Karandi Winter Linen",
        slug: "textured-karandi-winter-linen",
        material: "Karandi Linen",
        price: 1750,
        stock: 25,
        description: "Cozy, hand-loomed slub texture offering structure and warmth.",
        images: ["https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000"],
        featured: false,
    }
]

const readyMadeData = [
    {
        name: "Crimson Velvet Embroidered Anarkali",
        slug: "crimson-velvet-embroidered-anarkali",
        price: 24500,
        stock: 12,
        sizes: ["S", "M", "L", "XL"],
        description: "Stately floor-length velvet Anarkali enriched with traditional dabka hand embroidery.",
        images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000"],
        featured: true,
    },
    {
        name: "Opal White Organza Cutwork Peshwas",
        slug: "opal-white-organza-cutwork-peshwas",
        price: 32000,
        stock: 8,
        sizes: ["S", "M", "L"],
        description: "Etherial multi-paneled flared kalidaar peshwas with handcrafted cutwork borders.",
        images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000"],
        featured: true,
    },
    {
        name: "Emerald Silk Angrakha Set",
        slug: "emerald-silk-angrakha-set",
        price: 18900,
        stock: 15,
        sizes: ["XS", "S", "M", "L"],
        description: "Classic cross-over wrap Angrakha silhouette tailored in pure silk.",
        images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000"],
        featured: true,
    },
    {
        name: "Pastel Mint Printed Lawn Co-ord Set",
        slug: "pastel-mint-printed-lawn-coord",
        price: 8500,
        stock: 45,
        sizes: ["S", "M", "L"],
        description: "Contemporary matching tunic and wide-leg trousers featuring block-print motifs.",
        images: ["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000"],
        featured: false,
    },
    {
        name: "Midnight Black Raw Silk Straight Suit",
        slug: "midnight-black-raw-silk-suit",
        price: 16200,
        stock: 5,
        sizes: ["S", "M", "L", "XL"],
        description: "Structured straight-cut raw silk long shirt featuring pearl hand-embellished slits.",
        images: ["https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000"],
        featured: true,
    },
    {
        name: "Dusty Rose Chiffon Flared Kurta",
        slug: "dusty-rose-chiffon-flared-kurta",
        price: 14800,
        stock: 22,
        sizes: ["S", "M", "L"],
        description: "Softly gathered flared tunic lined with cotton silk, featuring threadwork floral sprigs.",
        images: ["https://images.unsplash.com/photo-1550639525-c97d455acf70?q=80&w=1000"],
        featured: false,
    },
    {
        name: "Sapphire Blue Embroidered Lawn 3-Piece",
        slug: "sapphire-blue-lawn-3-piece",
        price: 11500,
        stock: 30,
        sizes: ["S", "M", "L", "XL"],
        description: "3-piece lawn set including an embroidered shirt, digital chiffon dupatta, and trousers.",
        images: ["https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000"],
        featured: false,
    },
    {
        name: "Champagne Gold Tissue Silk Saree",
        slug: "champagne-gold-tissue-silk-saree",
        price: 28500,
        stock: 4,
        sizes: ["Free Size"],
        description: "Pre-stitched pleated tissue silk saree showcasing a metallic luster.",
        images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000"],
        featured: true,
    },
    {
        name: "Maroon Mirror-Work Kurta & Pants",
        slug: "maroon-mirror-work-kurta-pants",
        price: 13900,
        stock: 18,
        sizes: ["S", "M", "L"],
        description: "Rich jewel-toned shirt accented with real mirror-work embroidery around the neckline.",
        images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000"],
        featured: false,
    },
    {
        name: "Ivory Pearl-Beaded Kaftan",
        slug: "ivory-pearl-beaded-kaftan",
        price: 21000,
        stock: 7,
        sizes: ["M", "L"],
        description: "Relaxed-fit draped silk kaftan tailored with handcrafted pearl bead clusters.",
        images: ["https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1000"],
        featured: false,
    }
]

async function main() {
    console.log("Seeding fabrics...")
    for (const fabric of fabricsData) {
        await prisma.fabric.upsert({
            where: { slug: fabric.slug },
            update: fabric,
            create: fabric,
        })
    }

    console.log("Seeding ready-made products...")
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