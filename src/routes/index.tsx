import { createFileRoute } from "@tanstack/react-router";
import SafeSpace from "@/components/SafeSpace";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Casetch — A safe space to be heard" },
      {
        name: "description",
        content:
          "A private, anonymous space for women to record incidents of assault and choose how they want them addressed.",
      },
      { property: "og:title", content: "Casetch — A safe space to be heard" },
      {
        property: "og:description",
        content:
          "Record your story anonymously. Choose your next step, on your own time.",
      },
    ],
  }),
  component: Index,
  ssr: false,
});

function Index() {
  return <SafeSpace />;
}
