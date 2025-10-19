interface NavbarProps {
  name?: string;
  imageURL?: string;
}

export default function Navbar({ name, imageURL }: NavbarProps) {
  return (
    <nav className="flex justify-between items-center px-8 py-2 bg-indigo-900 h-20">
      <div>
        <h1 className="text-3xl font-bold text-indigo-100">Chore Masters</h1>
      </div>
      <div className="flex justify-between items-center gap-4 text-lg text-indigo-100">
        {name ? <h1>Welcome, {name}</h1> : ""}
        {imageURL && (
          <img
            className="w-12 h-12 object-cover border rounded-full border-gray-200"
            src={imageURL}
          />
        )}
      </div>
    </nav>
  );
}
