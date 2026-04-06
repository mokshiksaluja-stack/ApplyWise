import { X, ExternalLink, FileText, BookOpen, MessageSquare, PlayCircle, Clock } from "lucide-react";

export default function ResourceModal({ resource, onClose }) {
  if (!resource) return null;

  const getTypeIcon = (type) => {
    switch(type) {
      case 'PDF': return <FileText size={16} className="text-blue-500" />;
      case 'Sheet': return <BookOpen size={16} className="text-emerald-500" />;
      case 'Link': return <ExternalLink size={16} className="text-purple-500" />;
      case 'Experience': return <MessageSquare size={16} className="text-amber-500" />;
      default: return <PlayCircle size={16} className="text-blue-500" />;
    }
  };

  const getDifficultyColor = (diff) => {
    switch(diff) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/95 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 shadow-sm">
              {getTypeIcon(resource.resourceType)}
            </span>
            <div className="pr-4">
               <h2 className="text-lg font-bold text-gray-900 line-clamp-1">{resource.title}</h2>
               <p className="text-xs font-semibold text-gray-500">{resource.company || resource.topic}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full bg-gray-50 p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 flex-shrink-0">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
           <div className="mb-6 flex flex-wrap gap-2">
             <span className="rounded border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700 uppercase tracking-wide">{resource.resourceType}</span>
             <span className={`rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${getDifficultyColor(resource.difficulty)}`}>{resource.difficulty}</span>
             <span className="rounded border border-blue-100 bg-blue-50 flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-blue-700 uppercase tracking-wide"><Clock size={12}/> {resource.estimatedTime}</span>
           </div>

           <div className="mb-6 rounded-xl bg-gray-50 p-5 text-sm text-gray-700 leading-relaxed border border-gray-100">
             <p className="font-semibold text-gray-900 mb-2">Overview / Description</p>
             {resource.description}
           </div>

           <div className="mb-8">
              <p className="font-semibold text-gray-900 text-sm mb-3">Relevance Tags</p>
              <div className="flex flex-wrap gap-2">
                 {resource.tags.map(tag => (
                   <span key={tag} className="text-[11px] font-bold text-gray-600 bg-white border border-gray-200 shadow-sm px-2.5 py-1 rounded-md uppercase tracking-wide">
                      {tag}
                   </span>
                 ))}
              </div>
           </div>

           <div className="flex justify-end pt-5 border-t border-gray-100">
               <button onClick={onClose} className="mr-3 rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100">
                 Cancel
               </button>
               <a href={resource.linkUrl || "#"} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition shadow-sm hover:bg-blue-700">
                 {resource.linkLabel || "Access Resource"} <ExternalLink size={16} />
               </a>
           </div>
        </div>
      </div>
    </div>
  );
}
