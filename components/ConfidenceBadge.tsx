interface ConfidenceBadgeProps {
  score: number; // 0-100
}

export default function ConfidenceBadge({ score }: ConfidenceBadgeProps) {
  // Determine color based on score
  let colorClasses = '';
  let label = '';

  if (score >= 70) {
    colorClasses = 'bg-green-100 text-green-800 border-green-300';
    label = 'High Confidence';
  } else if (score >= 50) {
    colorClasses = 'bg-yellow-100 text-yellow-800 border-yellow-300';
    label = 'Medium Confidence';
  } else {
    colorClasses = 'bg-red-100 text-red-800 border-red-300';
    label = 'Low Confidence';
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses}`}
      title={`Confidence Score: ${score}/100`}
    >
      {label} ({score})
    </span>
  );
}
