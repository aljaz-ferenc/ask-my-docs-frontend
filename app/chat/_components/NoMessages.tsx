import Image from "next/image";

export default function NoMessages() {
  return (
    <div className="text-center h-full">
      <Image
        width={300}
        height={300}
        alt="bot logo"
        src="/logo-no-bg.png"
        className="mx-auto mt-20"
      />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Hi there!
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        I'm your AI assistant, ready to help you with the content of your
        uploaded files.
      </p>
    </div>
  );
}
