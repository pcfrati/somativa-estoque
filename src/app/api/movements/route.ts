import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Movement from "@/models/Movement";
import Product from "@/models/Product";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");

    const movements = await Movement.find()
      .populate("product", "name sku")
      .populate("operator", "name")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Movement.countDocuments();

    return NextResponse.json({
      movements,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get movements error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const { productId, type, quantity, notes } = await request.json();

    // Validações
    if (!productId || !type || !quantity) {
      return NextResponse.json(
        { error: "Produto, tipo e quantidade são obrigatórios" },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { error: "A quantidade deve ser maior que zero" },
        { status: 400 }
      );
    }

    // Encontrar produto
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // Verificar estoque para saída
    if (type === "saida") {
      if (product.currentQuantity < quantity) {
        return NextResponse.json(
          {
            error: `Quantidade insuficiente em estoque. Disponível: ${product.currentQuantity}`,
          },
          { status: 400 }
        );
      }
    }

    // Atualizar quantidade do produto
    if (type === "entrada") {
      product.currentQuantity += quantity;
    } else if (type === "saida") {
      product.currentQuantity -= quantity;
    }

    await product.save();

    // Registrar movimentação
    const movement = await Movement.create({
      product: productId,
      type,
      quantity,
      operator: decoded.userId,
      notes: notes || "",
    });

    // Buscar movimentação
    const populatedMovement = await Movement.findById(movement._id)
      .populate("product", "name sku")
      .populate("operator", "name");

    return NextResponse.json(populatedMovement, { status: 201 });
  } catch (error: any) {
    console.error("Create movement error:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}