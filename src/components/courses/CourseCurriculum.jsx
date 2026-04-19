import { useState } from 'react';
import { HiChevronDown, HiPlay, HiDocumentText } from 'react-icons/hi';

const CourseCurriculum = ({ lessons = [] }) => {
  const [openModules, setOpenModules] = useState({});

  // Group lessons by moduleName
  const modules = lessons.reduce((acc, lesson) => {
    const mod = lesson.moduleName || 'Module 1';
    if (!acc[mod]) acc[mod] = [];
    acc[mod].push(lesson);
    return acc;
  }, {});

  const toggleModule = (mod) => {
    setOpenModules(prev => ({ ...prev, [mod]: !prev[mod] }));
  };

  if (!lessons.length) {
    return (
      <div className="text-center py-10 text-dark-400">
        <p>Curriculum details will be available soon.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Object.entries(modules).map(([moduleName, moduleLessons], idx) => (
        <div key={idx} className="border border-dark-100 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleModule(moduleName)}
            className="w-full flex items-center justify-between px-5 py-4 bg-dark-50 hover:bg-dark-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">
                {idx + 1}
              </span>
              <div className="text-left">
                <h4 className="font-heading font-semibold text-dark-800 text-sm">{moduleName}</h4>
                <p className="text-xs text-dark-400">{moduleLessons.length} lessons</p>
              </div>
            </div>
            <HiChevronDown className={`w-5 h-5 text-dark-400 transition-transform ${openModules[moduleName] ? 'rotate-180' : ''}`} />
          </button>

          {openModules[moduleName] && (
            <div className="divide-y divide-dark-50">
              {moduleLessons.map((lesson, li) => (
                <div key={li} className="flex items-center gap-3 px-5 py-3 hover:bg-dark-50 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-dark-100 flex items-center justify-center flex-shrink-0">
                    {lesson.videoUrl ? (
                      <HiPlay className="w-3 h-3 text-primary-600" />
                    ) : (
                      <HiDocumentText className="w-3 h-3 text-gold-600" />
                    )}
                  </div>
                  <span className="text-sm text-dark-700 flex-1">{lesson.title}</span>
                  {lesson.duration && (
                    <span className="text-xs text-dark-400">{lesson.duration}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseCurriculum;
