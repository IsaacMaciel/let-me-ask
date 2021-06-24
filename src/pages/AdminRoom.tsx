import { useHistory, useParams } from "react-router-dom";
import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import { useAuth } from "../contexts/AuthContext";

import { RoomCode } from "../components/RoomCode";
import { Button } from "../components/Button";
import { Question } from "../components/Question/";

import "../styles/room.scss";
import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";

type RoomParams = {
  id: string;
};

export const AdminRoom = () => {
  const { user } = useAuth();
  const history = useHistory()
  const params = useParams<RoomParams>();
  const { questions, title } = useRoom(params.id);

  const handleEndRoom = async () => {
    database.ref(`rooms/${params.id}`).update({
      endedAt: new Date()
    })

    history.push('/')
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm('Tem certeza que vocÊ deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${params.id}/questions/${questionId}`).remove()
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={params.id} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions &&
            questions.map((question) => {
              return (
                <Question
                  key={question.content}
                  content={question.content}
                  author={question.author}
                >
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <img src={deleteImg} alt="Remover pergunta" />
                  </button>
                </Question>
              );
            })}
        </div>
      </main>
    </div>
  );
};
