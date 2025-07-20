import { Link } from "react-router"
import { Button } from "./ui/Button"

export const CreatePost = () => {
  return (
    <div>
      <Link to="/home"><Button>Post</Button></Link>
    </div>
  )
}
