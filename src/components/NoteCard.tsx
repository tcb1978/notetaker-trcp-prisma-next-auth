import { useState, type FC } from "react";

import ReactMarkdown from "react-markdown";

import { type RouterOutputs } from "~/utils/api";

type Note = RouterOutputs["note"]["getAll"][0];

interface NoteCardProps {
  note: Note;
  onDelete: () => void;
}

export const NoteCard: FC<NoteCardProps> = ({ note, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="mt-5 border-gray-200 shadow-xl card bg-base-100">
      <div className="p-3 m-0 card-body">
        <div
          className={`collapse-arrow ${
            isExpanded ? "collapse-open" : ""
          } collapse`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="text-xl font-bold collapse-title">{note.title}</div>

          <div className="cooapse-content">
            <article className="lg:prose-xl prose">
              <ReactMarkdown>{note.content}</ReactMarkdown>
            </article>
          </div>

          <div className="flex justify-end mx-2 card-actions">
            <button className="px-5 btn-warning btn-xs btn" onClick={onDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
