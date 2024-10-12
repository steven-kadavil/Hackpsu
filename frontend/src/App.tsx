import styles from "./App.module.css"

function App() {
  return (
    <>
    <label className={styles.conversation_input_label}>Talk to our AI to build your Career Roadmap</label>
    <div className={styles.top_section}>
      <input className={styles.conversation_input} placeholder="Enter your Career Goals"></input>
      <button className={styles.conversation_button}></button>
    </div>
    </>
  )
}

export default App
