import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { name, email, password, role } = await request.json();

    console.log("Tentativa de registro:", { name, email, role });

    // Validações
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nome, email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log("Usuário já existe:", email);
      return NextResponse.json(
        { error: "Usuário já existe com este email" },
        { status: 400 }
      );
    }

    // Criar novo usuário
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      role: role || "operador",
    });

    console.log("Usuário criado com sucesso:", user.email);

    // Gerar token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erro no registro:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Email já está em uso" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}