import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "~/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import CreateCharacterForm from "./_components/character/CreateCharacterForm";
import CharacterList from "./_components/character/CharacterList";
import SpellPageUserWrapper from "~/app/_components/SpellPage/SpellPageUserWrapper";
import { Suspense } from "react";
import PreparedSpellDnd from "./_components/PreparedSpellDnd";
import CreateBookForm from "./_components/book/CreateBookForm";
import BookList from "./_components/book/BookList";
import CopyBookForm from "./_components/book/CopyBookForm";
import Loading from "~/components/ui/loading";

export default async function LibraryPage() {
  return (
    <Suspense fallback={<Loading />}>
      <div className="h-full w-full">
        <ResizablePanelGroup className="w-full" direction="horizontal">
          <ResizablePanel defaultSize={10} style={{ overflow: "auto" }}>
            <Tabs
              defaultValue="characters"
              className="grid w-full grid-rows-[auto,1fr]"
            >
              <TabsList className="rounded-none">
                <TabsTrigger value="characters">Characters</TabsTrigger>
                <TabsTrigger value="books">Books</TabsTrigger>
              </TabsList>
              <TabsContent value="characters">
                <CreateCharacterForm />
                <CharacterList />
              </TabsContent>
              <TabsContent value="books">
                <CreateBookForm />
                <CopyBookForm />
                <BookList />
              </TabsContent>
            </Tabs>
          </ResizablePanel>
          <ResizableHandle className="" />
          <ResizablePanel
            className="p-4"
            style={{ overflow: "auto" }}
            defaultSize={20}
          >
            <PreparedSpellDnd />
          </ResizablePanel>
          <ResizableHandle className="" />
          <ResizablePanel
            style={{ overflow: "auto" }}
            className="overflow-auto pb-8"
            defaultSize={80}
          >
            <SpellPageUserWrapper />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </Suspense>
  );
}
