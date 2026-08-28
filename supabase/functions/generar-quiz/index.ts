import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    // Recibe el concepto y los apuntes
    const { concepto, contenido_fuente } = await req.json();

    // Verifica que lleguen los datos
    if (!concepto || !contenido_fuente) {
      return new Response(
        JSON.stringify({
          error: "Faltan datos para generar el quiz.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Obtiene la clave de Gemini guardada en Supabase
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "No existe la clave de Gemini.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Instrucciones que recibe la IA
    const prompt = `
Genera un quiz sobre el concepto "${concepto}".

Usa solamente la siguiente información proporcionada por el usuario:

${contenido_fuente}

Genera exactamente 3 preguntas.

Cada pregunta debe tener:
- una pregunta
- 3 opciones
- una sola respuesta correcta

Devuelve solamente JSON con este formato:

{
  "preguntas": [
    {
      "pregunta": "Pregunta",
      "opciones": [
        "Opción 1",
        "Opción 2",
        "Opción 3"
      ],
      "correcta": 0
    }
  ]
}

Reglas:
- "correcta" debe ser 0, 1 o 2.
- No uses información externa.
- No inventes información.
- Las preguntas deben basarse en los apuntes.
- No escribas nada fuera del JSON.
`;

    // Envía la información a Gemini
    const respuesta = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],

          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );

    // Convierte la respuesta de Gemini
    const resultado = await respuesta.json();

    // Si Gemini devuelve un error
    if (!respuesta.ok) {
      console.log("Error Gemini:", resultado);

      return new Response(
        JSON.stringify({
          error: "Gemini no pudo generar el quiz.",
          detalle: resultado,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Obtiene el texto generado por Gemini
    const texto =
      resultado.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!texto) {
      return new Response(
        JSON.stringify({
          error: "Gemini no devolvió contenido.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Convierte el texto generado a JSON
    const quiz = JSON.parse(texto);

    // Verifica que existan preguntas
    if (!quiz.preguntas || quiz.preguntas.length === 0) {
      return new Response(
        JSON.stringify({
          error: "Gemini no generó preguntas.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Envía el quiz al celular
    return new Response(
      JSON.stringify(quiz),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    // Si ocurre cualquier otro error
    console.log("Error generar quiz:", error);

    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
});