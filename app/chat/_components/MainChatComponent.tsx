import Messages from "@/app/chat/_components/Messages";
import NoFiles from "@/app/chat/_components/NoFiles";
import { getFilePreviews } from "@/lib/actions";

export default async function MainComponent() {
  const files = await getFilePreviews();

  if (files.length === 0) {
    return <NoFiles />;
  }

  return <Messages />;
}
