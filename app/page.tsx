"use client";

import { Button, Container } from "@mantine/core";

const KeywordExtractorForm = () => {
  const handleButtonClick = async () => {
    try {
      const response = await fetch("/api/text-extractor");
      const result = await response.json();

      const entities = result.response.entities;
      entities.forEach((entity: { matchedText: string; wikiLink: string }) => {
        console.log({ text: entity.matchedText, wiki: entity.wikiLink });
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Container size="md">
      <Button onClick={handleButtonClick} color="blue">
        Submit
      </Button>
    </Container>
  );
};

export default KeywordExtractorForm;
