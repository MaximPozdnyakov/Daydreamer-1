import modalStyles from "../../../styles/modal.module.css";
import globalStyles from "../../../styles/global.module.css";
import { xhr } from "../../../helpers/xhr";
import Router from "next/router";
import { useContext } from "react";

import { ProjectsContext } from "../../context/projects/ProjectsContext";
import { TasksContext } from "../../context/tasks/TasksContext";

export default function DeleteAccountModal({ setModal }) {
  const { deleteAllProjects } = useContext(ProjectsContext);
  const { deleteAllTasks } = useContext(TasksContext);

  const outsideClick = (e) => {
    if (e.target.id === "delete_account_wrapper") {
      setModal(false);
    }
  };

  const deleteQuery = async () => {
    await deleteAllTasks();
    await deleteAllProjects();
    await xhr("/auth/delete", {}, "DELETE");
    Router.reload();
  };

  return (
    <>
      <div className={modalStyles.modalBlock} />
      <div
        className={modalStyles.modalWrap}
        onClick={outsideClick}
        id="delete_account_wrapper"
      >
        <div className={modalStyles.deleteAccountModal}>
          <div>
            <div className={modalStyles.deleteAccountTitle}>Delete account</div>
            <div className={modalStyles.deleteAccountDescription}>
              Are you sure you want to <br />
              delete your account?
            </div>
            <div className={globalStyles.twoButtons}>
              <div
                className={modalStyles.deleteAccountSecondaryButton}
                onClick={setModal.bind(null, "account")}
              >
                No
              </div>
              <div
                className={modalStyles.deleteAccountPrimaryButton}
                onClick={deleteQuery}
              >
                Yes
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
