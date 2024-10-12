import styles from "./App.module.css"
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

const proOptions = { hideAttribution: true };

function App() {
  return (
    <>
    <label className={styles.conversation_input_label}>Talk to our AI to build your Career Roadmap.</label>
    <div className={styles.top_section}>
      <input className={styles.conversation_input} placeholder="Enter your Career Goals"></input>
      <button className={styles.conversation_button}></button>
    </div>
    <div className={styles.roadmap_canvas}>
      <ReactFlow nodes={initialNodes} edges={initialEdges} proOptions={proOptions} fitView>
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
    </>
  )
}

export default App
