import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { productId } = await request.json()

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 })
    }

    // Here you would typically interact with your database or cart management system
    // to remove the product from the user's cart.  For example:
    // await prisma.cartItem.delete({
    //   where: {
    //     productId: productId,
    //     userId: userId, // Assuming you have a way to identify the user
    //   },
    // });

    // For this example, we'll just return a success message.
    return NextResponse.json({ message: "Product removed from cart" })
  } catch (error) {
    console.error("[CART_REMOVE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
