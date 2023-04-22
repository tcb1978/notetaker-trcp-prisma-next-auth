import { useState } from "react";
import { useSession } from "next-auth/react";
import type { FC } from "react";
import { api, type RouterOutputs } from "~/utils/api";
import { NoteCard, NoteEditor } from ".";

type Topic = RouterOutputs["topic"]["getAll"][0];

export const Content: FC = () => {
  const { data: sessionData } = useSession();

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const { data: topics, refetch: refetchTopics } = api.topic.getAll.useQuery(
    undefined, // no input
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        setSelectedTopic(selectedTopic ?? data[0] ?? null);
      },
    }
  );

  const createTopic = api.topic.create.useMutation({
    onSuccess: () => {
      void refetchTopics();
    },
  });

  const { data: notes, refetch: refetchNotes } = api.note.getAll.useQuery(
    {
      topicId: selectedTopic?.id ?? "",
    },
    {
      enabled: sessionData?.user !== undefined && selectedTopic !== null,
    }
  );

  const createNote = api.note.create.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });

  const deleteNote = api.note.delete.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });

  console.log("notes: ", notes);

  return (
    <>
      <div className="grid md:grid-cols-4">
        <div className="px-2 md:col-span-1">
          <menu className="menu rounded-box w-56 bg-base-100 p-2">
            {topics?.map((topic) => (
              <li key={topic.id}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedTopic(topic);
                  }}
                >
                  {topic.title}
                </a>
              </li>
            ))}
          </menu>
          <span className="divider"></span>
          <input
            type="text"
            placeholder="New Topic"
            className="input-bordered input input-sm w-full"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                createTopic.mutate({
                  title: e.currentTarget.value,
                });
                e.currentTarget.value = "";
              }
            }}
          />
        </div>
        <div className="md:col-span-3">
          <section>
            {!!notes && (
              <>
                {notes.map((note) => (
                  <>
                    <div key={note.id} className="mt-5">
                      <NoteCard
                        note={note}
                        onDelete={() => void deleteNote.mutate({ id: note.id })}
                      />
                    </div>
                  </>
                ))}
              </>
            )}
            <NoteEditor
              onSave={({ title, content }) => {
                void createNote.mutate({
                  title,
                  content,
                  topicId: selectedTopic?.id ?? "",
                });
              }}
            />
          </section>
        </div>
      </div>
    </>
  );
};
