import styles from "@/styles/calendar.module.scss";
import Scrollbar from "react-scrollbars-custom";

import LineTasksRoot from "@/src/components/tasks/Line/LineTasksRoot";

export default function LineTasks({
  setMenu,
  editedTask,
  setEditedTask,
  calendarStartDate,
  view,
}) {
  let calendarWidth = 0;
  document.querySelectorAll(".month").forEach((el) => {
    calendarWidth += el.offsetWidth;
  });

  return (
    <div
      className={styles.scrollContainer}
      style={{ top: view == "Day" ? 73 : 68 }}
    >
      <Scrollbar
        style={{
          height: editedTask ? "calc(100vh - 563px)" : "calc(100vh - 177px)",
          width: calendarWidth,
        }}
        noScrollX={true}
        trackYProps={{
          renderer: (props) => {
            const { elementRef, ...restProps } = props;
            return (
              <div
                {...restProps}
                ref={elementRef}
                style={{
                  height: editedTask
                    ? "calc(100% - 182px - 37px - 380px)"
                    : "calc(100% - 182px - 37px)",
                }}
                className="ScrollbarsCustom-Track ScrollbarsCustom-TrackY ScrollbarsCustom-TaskLines"
              />
            );
          },
        }}
      >
        <div>
          <LineTasksRoot
            calendarStartDate={calendarStartDate}
            setMenu={setMenu}
            editedTask={editedTask}
            setEditedTask={setEditedTask}
            root={""}
            view={view}
          />
        </div>
      </Scrollbar>
    </div>
  );
}
