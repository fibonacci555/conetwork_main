import { NextResponse } from 'next/server';
import supabase from '@/utils/supabaseClient';

// Função para lidar com a requisição GET - não será usada para /update mas deixarei aqui como exemplo
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    try {
        const { data, error } = await supabase
            .from('knowledges')
            .select('knowledges')
            .eq('user_id', userId)
            .single();

        if (error) {
            return NextResponse.json({ message: "Knowledges not found", error }, { status: 404 });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error", error }, { status: 500 });
    }
}

// Função para lidar com a requisição POST
export async function POST(req) {
    const { userId, knowledges } = await req.json();

    if (!userId || !Array.isArray(knowledges)) {
        return NextResponse.json({ message: "Invalid data format" }, { status: 400 });
    }

    try {
        // Verifica se já existe um registro para o utilizador
        const { data: existingData, error: existingError } = await supabase
            .from('knowledges')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (existingError && existingError.code !== "PGRST116") {
            return NextResponse.json({ message: "Error fetching existing data", existingError }, { status: 500 });
        }

        let result;
        if (existingData) {
            // Atualiza os conhecimentos se o utilizador já existir
            const { data, error } = await supabase
                .from('knowledges')
                .update({ knowledges })
                .eq('user_id', userId);

            if (error) {
                throw error;
            }
            result = data;
        } else {
            // Cria um novo registro se não existir
            const { data, error } = await supabase
                .from('knowledges')
                .insert([{ user_id: userId, knowledges }]);

            if (error) {
                throw error;
            }
            result = data;
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error", error }, { status: 500 });
    }
}
