import * as cookie from "cookie";
const jwt = require("jsonwebtoken");

import Head from "next/head";
import { useState, useContext } from "react";
import styles from "./Gantt.module.css";
import { xhr } from "../../helpers/xhr";
import GantChart from "../../ganttChart/ganttChart";
import { Modal } from "../../ganttChart/components/modal/modal";
import { ViewSwitcher } from "../../ganttChart/components/viewSwitcher/viewSwitcher";
import { ViewMode } from "../../ganttChart/types/public-types";

import { UsersContext } from "../../ganttChart/context/users/UsersContext";
import { ProjectsContext } from "../../ganttChart/context/projects/ProjectsContext";
import { TasksContext } from "../../ganttChart/context/tasks/TasksContext";

import Menu from "../../ganttChart/components/menu/Menu";

import { When } from "react-if";

// name of project
let id = "new";

export default function Gantt({ charts: arr, currentChart }) {
  if (currentChart) currentChart = JSON.parse(currentChart).chart;

  const [charts, setCharts] = useState(arr ? JSON.parse(arr) : []);
  const [name, setName] = useState("");
  const [load, setLoad] = useState(currentChart ? currentChart : []);
  const [chart, setChart] = useState(currentChart ? currentChart : []);
  const [modal, setModal] = useState(false);
  const [view, setView] = useState(ViewMode.Day);

  const userCtx = useContext(UsersContext);
  const { isProjectsLoaded } = useContext(ProjectsContext);
  const { isTasksLoaded } = useContext(TasksContext);

  const request = (query) => {
    setModal("loader");
    xhr("/gantt", { ...query }, "POST").then((res) => {
      if (res.message === "ok") {
        setModal(false);
        setCharts(res.charts);
      } else setModal(res.message);
    });
  };

  return (
    <>
      <Head>
        {" "}
        <title> Daydreamer | Put your ideas on a timeline </title>{" "}
      </Head>
      <When
        condition={userCtx.isUserLoaded && isProjectsLoaded && isTasksLoaded}
      >
        <Modal
          modal={modal}
          setModal={setModal}
          request={request}
          chart={chart}
          id={id}
          mapName={name}
        />
        <div className={styles.container}>
          <Menu modal={modal} />
          <div className={styles.header}>
            <ViewSwitcher onViewModeChange={(viewMode) => setView(viewMode)} />
            <div />
            {name && (
              <div>
                Текущий проект - <b>{name}</b>
              </div>
            )}
            <div className={styles.buttonsContainer}>
              <button
                className={styles.share_button}
                onClick={setModal.bind(null, "share")}
              >
                Share Project
              </button>
              <button
                className={styles.account_button}
                onClick={setModal.bind(null, "account")}
              >
                <img src="/img/avatar.svg" alt=" " />{" "}
                <span>
                  {userCtx.name.length > 10
                    ? userCtx.name.slice(0, 10) + "..."
                    : userCtx.name}
                </span>
              </button>
            </div>
          </div>
          <div className={styles.gantChartWrap}>
            <div style={{ minWidth: "700px" }}>
              <GantChart
                chart={chart}
                setChart={setChart}
                load={load}
                view={view}
              />
            </div>
          </div>
        </div>
      </When>
    </>
  );
}

export async function getServerSideProps(ctx) {
  let user, charts, currentChart;

  try {
    const token = cookie.parse(ctx.req.headers.cookie).ganttToken;
    user = jwt.verify(token, "jwtSecret");
  } catch (e) {
    ctx.res.setHeader(
      "Set-Cookie",
      cookie.serialize("ganttToken", "", {
        maxAge: 0,
        path: "/",
        sameSite: true,
        secure: true,
      })
    );
  }

  if (!user) {
    return {
      redirect: {
        destination: "/signup",
        permanent: false,
      },
    };
  }

  try {
    const getDB = require("../../helpers/getDb");
    const Gantt = getDB("Gantt");
    if (user.id) charts = await Gantt.find({ user: user.id });
    currentChart = await Gantt.findOne({ _id: ctx.query.id });
  } catch (e) {}

  return {
    props: {
      charts: charts ? JSON.stringify(charts) : null,
      currentChart: currentChart ? JSON.stringify(currentChart) : null,
    },
  };
}
