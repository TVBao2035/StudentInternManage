import { useDispatch, useSelector } from "react-redux"
import { updateName } from "./redux/userSlice";

export default function App() {
  const dispatch = useDispatch();
  dispatch(updateName("BaoBao"));
  const user = useSelector(state => state.user);
  console.log(user);
  return (
    <div className="App">
      <h1 className="text-blue-500 bg-amber-200">
        {
          `Hello ${user.name}`
        }
      </h1>
    </div>
  )
}