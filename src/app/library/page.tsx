import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "~/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/server";
import CreateCharacterForm from "./_components/CreateCharacterForm";
import CharacterList from "./_components/CharacterList";
import SpellPageWrapper from "./_components/SpellPageWrapper";
import PreparedLevelSpellTable from "./_components/PreparedLevelSpellTable";
import { Suspense } from "react";

export default async function LibraryPage() {
  void api.character.getMyCharacters.prefetch();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="h-full w-full">
        <ResizablePanelGroup className="w-full" direction="horizontal">
          <ResizablePanel
            style={{ overflow: "auto" }}
            className="hidden overflow-auto pb-8 md:flex"
            defaultSize={20}
          >
            <ResizablePanelGroup className="w-full" direction="vertical">
              <ResizablePanel defaultSize={30}>
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
                  <TabsContent value="books">under construction</TabsContent>
                </Tabs>
              </ResizablePanel>
              <ResizableHandle className="" />
              <ResizablePanel className="p-4" defaultSize={70}>
                <h1 className="text-lg font-bold">Prepared Spells</h1>
                <PreparedLevelSpellTable />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle className="" />
          <ResizablePanel
            style={{ overflow: "auto" }}
            className="overflow-auto pb-8"
            defaultSize={80}
          >
            <SpellPageWrapper />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </Suspense>
  );
}
