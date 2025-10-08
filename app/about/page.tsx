import { Card, CardContent } from "@/components/ui/card";

const ragSteps = [
  {
    title: "Load",
    description: "Your documents are uploaded and read into the system.",
  },
  {
    title: "Chunk",
    description:
      "The text is split into smaller chunks for better search precision.",
  },
  {
    title: "Embed",
    description:
      "Each chunk is converted into a numerical vector using an embedding model.",
  },
  {
    title: "Store",
    description: "The generated vectors are stored in a vector database.",
  },
  {
    title: "Retrieve",
    description:
      "When you ask a question, the most relevant chunks are retrieved based on similarity.",
  },
  {
    title: "Answer",
    description:
      "The retrieved context and your query are passed to the language model.",
  },
];

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow mt-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-5xl">
            About AskMyDocs
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            An open-source RAG application to chat with your documents.
          </p>
        </div>
        <div className="space-y-16">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
              How It Works
            </h3>
            <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
              AskMyDocs uses a Retrieval-Augmented Generation (RAG) pipeline to
              provide answers from your documents. This process ensures that
              responses are accurate and grounded in the provided context and
              not only the model's training data.
            </p>
            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 text-center">
              {ragSteps.map((step, index) => (
                <Card
                  key={step.title}
                  className="p-0 bg-background-light dark:bg-slate-800/50 border-slate-800"
                >
                  <CardContent className=" p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary font-bold text-xl mb-4">
                      {index + 1}
                    </div>
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                      {step.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
