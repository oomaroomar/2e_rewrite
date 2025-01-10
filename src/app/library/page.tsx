import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "~/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/server";
import CreateCharacterForm from "./_components/CreateCharacterForm";
import CharacterList from "./_components/CharacterList";
import SpellPage from "../_components/SpellPage/SpellPageContainer";
import SpellPageWrapper from "./_components/SpellPageWrapper";

export default async function LibraryPage() {
  void api.character.getMyCharacters.prefetch();

  return (
    <div className="h-full w-full">
      <ResizablePanelGroup className="w-full" direction="horizontal">
        <ResizablePanel
          style={{ overflow: "auto" }}
          className="hidden overflow-auto pb-8 md:flex"
          defaultSize={20}
        >
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
        <ResizablePanel
          style={{ overflow: "auto" }}
          className="overflow-auto pb-8"
          defaultSize={80}
        >
          <ResizablePanelGroup className="w-full" direction="vertical">
            <ResizablePanel defaultSize={20}>
              <div>prepared spells here</div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={80}>
              <SpellPageWrapper />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
