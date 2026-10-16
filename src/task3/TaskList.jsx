export default function TaskList({ tasks }) {
  const items = [];
  for (let i = 0; i < tasks.length; i++) {
    items.push(
      <li key={tasks[i].id} className="rounded border border-gray-200 bg-white px-3 py-2">
        {tasks[i].title}
      </li>
    );
  }
  return <ul className="space-y-2">{items}</ul>;
}
