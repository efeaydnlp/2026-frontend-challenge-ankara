import type { Person } from "../../types/investigation";
import EmptyState from "../common/EmptyState";
import PersonCard from "./PersonCard";

type PersonListProps = {
  people: Person[];
  selectedPersonId: string | null;
  onSelectPerson: (personId: string) => void;
};

function PersonList({
  people,
  selectedPersonId,
  onSelectPerson,
}: PersonListProps) {
  if (people.length === 0) {
    return (
      <EmptyState
        title="No people found"
        description="Try changing your search or filter to find matching records."
      />
    );
  }

  return (
    <div className="space-y-3">
      {people.map((person) => (
        <PersonCard
          key={person.id}
          person={person}
          isSelected={selectedPersonId === person.id}
          onClick={() => onSelectPerson(person.id)}
        />
      ))}
    </div>
  );
}

export default PersonList;
