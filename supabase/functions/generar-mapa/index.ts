import "@supabase/functions-js/edge-runtime.d.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const GEMINI_MODEL = "gemini-3-flash-preview";

const schema = {
  type: "object",
  properties: {
    tema: {
      type: "string",
      description: "El tema principal que el estudiante quiere estudiar."
    },
    conceptos: {
      type: "array",
      description: "Conceptos relacionados con el tema y sus prerrequisitos.",
      items: {
        type: "object",
        properties: {
          nombre: {
            type: "string",
            description: "Nombre del concepto."
          },
          requiere: {
            type: "array",
            description: "Conceptos que deben conocerse antes de estudiar este concepto.",
            items: {
              type: "string"
            }
          }
        },
        required: ["nombre", "requiere"]
      }
    }
  },
  required: ["tema", "conceptos"]
};

Deno.serve(async (req: Request) => {
  try {
    // Verificar que exista la API key
    if (!GEMINI_API_KEY) {
      return Response.json(
        {
          error: "GEMINI_API_KEY no está configurada en Supabase."
        },
        { status: 500 }
      );
    }

    // Obtener el tema enviado por la aplicación
    const body = await req.json();
    const tema = body.tema;
    const contenidoFuente = body.contenido_fuente;

    if (!tema || typeof tema !== "string") {
      return Response.json(
        {
          error: "Debes enviar un tema válido."
        },
        { status: 400 }
      );
    }

    if (!contenidoFuente || typeof contenidoFuente !== "string") {
      return Response.json(
        {
          error: "Debes enviar información válida sobre el tema."
        },
        { status: 400 }
      );
    }

    // Prompt para Gemini
    const prompt = `
Eres un asistente educativo especializado en organizar información de estudio.

El estudiante está estudiando el siguiente tema:

"${tema}"

Esta es la información proporcionada directamente por el estudiante:

"""
${contenidoFuente}
"""

Tu tarea es convertir ÚNICAMENTE la información proporcionada por el estudiante
en un mapa de conocimiento.

REGLAS IMPORTANTES:

- Usa únicamente conceptos que aparezcan o puedan identificarse directamente
  en la información proporcionada.
- NO agregues información externa.
- NO inventes conceptos que no estén presentes en los apuntes.
- Identifica entre 5 y 10 conceptos cuando la información lo permita.
- El concepto principal debe estar relacionado con el tema.
- Para cada concepto indica qué otros conceptos de los mismos apuntes
  deberían conocerse antes.
- Si un concepto no necesita prerrequisitos, devuelve una lista vacía.
- No repitas conceptos.
- Mantén los nombres de los conceptos cortos y claros.
- Devuelve únicamente el JSON solicitado.
`;

    // Llamar a Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema
          }
        })
      }
    );

    // Si Gemini devuelve un error
    if (!response.ok) {
      const errorText = await response.text();

      console.error("Error de Gemini:", errorText);

      return Response.json(
        {
          error: "Gemini devolvió un error.",
          details: errorText
        },
        { status: 500 }
      );
    }

    const result = await response.json();

    // Obtener el texto generado por Gemini
    const generatedText =
      result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return Response.json(
        {
          error: "Gemini no devolvió contenido."
        },
        { status: 500 }
      );
    }

    // Convertir la respuesta JSON de Gemini
    const mapa = JSON.parse(generatedText);

    // Devolver el mapa a Mentalis
    return Response.json(mapa);

  } catch (error) {
    console.error("Error en generar-mapa:", error);

    return Response.json(
      {
        error: "Ocurrió un error al generar el mapa.",
        details: error instanceof Error
          ? error.message
          : String(error)
      },
      { status: 500 }
    );
  }
});