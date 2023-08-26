import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";

const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
});

async function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);

  try {
    const apiKey = "example_key";
    if (!apiKey) {
      throw new Error("API_KEY is not defined");
    }

    const urlencoded = new URLSearchParams();
    urlencoded.append("extractors", "entities,entailments");
    urlencoded.append(
      "text",
      "This study has demonstrated that higher relative humidity and wind speed, and lower atmospheric pressure, were associated with increased pain severity in people with long-term pain conditions"
    );

    const requestOptions = {
      method: "POST",
      headers: {
        "x-textrazor-key": apiKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlencoded,
    };

    const response = await fetch("https://api.textrazor.com/", requestOptions);
    const result = await response.json();

    const entities = result.response.entities;
    entities.forEach((entity: { matchedText: string; wikiLink: string }) => {
      console.log({ text: entity.matchedText, wiki: entity.wikiLink });
    });

    res.status(200).json(result); // Respond with the result or appropriate response
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "An error occurred" });
  }
}
