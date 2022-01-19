import { useRef, useState } from 'react';

import { QuestionType } from '../../hooks/useRoom';

import { Question } from '../Question';
import { QuestionForm } from '../QuestionForm';

import './styles.scss';

type QuestionProps = {
    isAdmin: boolean;
    question: QuestionType;
}

export function QuestionBox({
    isAdmin,
    question
}: QuestionProps) {
    const [isAnswerFormOpen, setIsAnswerFormOpen] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const questionRef = useRef<HTMLDivElement>(null);

    function switchCommentsVisibility() {
        if (isCommentsOpen) {
            setIsCommentsOpen(false);
        } else {
            setIsCommentsOpen(true);
        }
    }

    function switchAnswerForm() {
        if (isAnswerFormOpen) {
            setIsAnswerFormOpen(false);
        } else {
            setIsAnswerFormOpen(true);
        }
    }

    return (
        <div className="question-box" ref={questionRef}>
            <Question 
                key={question.id}
                isAdmin={isAdmin}
                isAnswer={false}
                question={question}
                refBase={`${question.id}`}
                showComments={switchCommentsVisibility}
                isCommentsOpen={isCommentsOpen}
                showAnswerForm={switchAnswerForm}
                isAnswerFormOpen={isAnswerFormOpen}
            />
            {isAnswerFormOpen &&
                <QuestionForm
                    isAnswer={true}
                    questionId={question.id}
                    closeAnswerForm={() => setIsAnswerFormOpen(false)}
                    showComments={switchCommentsVisibility}
                    isCommentsOpen={isCommentsOpen}
                />
            }
            {isCommentsOpen && question.answers.map(answer => {
                return (
                    <Question
                        key={answer.id}
                        isAdmin={isAdmin}
                        isAnswer={true}
                        question={answer}
                        refBase={`${question.id}/answers/${answer.id}`}
                    />
                );
            })}
        </div>
    );
}