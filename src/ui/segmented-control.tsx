type Option<T extends string> = { value: T; label: string };

type SegmentedControlProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
};

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: SegmentedControlProps<T>) {
  return (
    <div className="inline-flex rounded-lg border border-app-border overflow-hidden">
      {options.map((option, i) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className={[
            "px-4 py-2 text-sm font-medium transition-colors",
            i > 0 ? "border-l border-app-border" : "",
            option.value === value
              ? "bg-app-primary text-white"
              : "bg-app-surface text-app-foreground hover:bg-app-primary-muted",
          ].join(" ")}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
