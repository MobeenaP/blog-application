'use client';

type FilterProps = {
  tag: string;
  setTag: (v: string) => void;
  date: string;
  setDate: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
};

export function Filter({ tag, setTag, date, setDate, content, setContent, sort, setSort }: FilterProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="block mt-4">
        <label htmlFor="tagFilter">Filter by Tag:</label>
        <input
          id="tagFilter"
          className="w-full border border-gray-300 h-12 outline-none px-3 mt-1 rounded"
          type="text"
          name="tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Search by tag"
        />
      </div>
      <div className="block mt-4">
        <label htmlFor="dateFilter">Filter by Date Created:</label>
        <input
          id="dateFilter"
          className="w-full border border-gray-300 h-12 outline-none px-3 mt-1 rounded"
          type="text"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Search by date (DDMMYYYY)"
        />
      </div>
      <div className="block mt-4">
        <label htmlFor="contentFilter">Filter by Content:</label>
        <input
          id="contentFilter"
          className="w-full border border-gray-300 h-12 outline-none px-3 mt-1 rounded"
          type="text"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Search by content"
        />
      </div>
      <div className="block mt-4">
        <label htmlFor="sortOption">Sort By:</label>
        <select
          id="sortOption"
          className="w-full border border-gray-300 h-12 outline-none px-3 mt-1 rounded"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Default</option>
          <option value="title-asc">Title (A-Z)</option>
          <option value="title-desc">Title (Z-A)</option>
          <option value="date-asc">Date (Oldest)</option>
          <option value="date-desc">Date (Newest)</option>
        </select>
      </div>
    </div>
  );
}