import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import { Providers } from "./components/Providers.tsx";
import { Login } from "./components/auth/Login.tsx";
import { PasswordLogin } from "./components/auth/PasswordLogin.tsx";
import { Signup } from "./components/auth/Signup.tsx";
import { Otp } from "./components/auth/Otp.tsx";
import { CreatePassword } from "./components/auth/CreatePassword.tsx";
import { Home } from "./components/Home.tsx";
import { CreateUser } from "./components/auth/CreateUser.tsx";
import { AuthMiddleware } from "./middleware/AuthMiddleware.tsx";
import { Toaster } from 'sonner';
import { Profile } from "./components/Profile.tsx";
import { Bookmarks } from "./components/Bookmarks.tsx";
import { HomeFeed } from "./components/HomeFeed.tsx";
import { Notifications } from "./components/Notifications.tsx";
import { ExtendedFeedPost } from "./components/ExtendedFeedPost.tsx";
import { ExtendedReply } from "./components/ExtendedReply.tsx";
import { UserConnections } from "./components/UserConnections.tsx";
import { Messages } from "./components/Messages.tsx";
import { ConversationHome } from "./components/ConversationHome.tsx";
import { MessagesHome } from "./components/MessagesHome.tsx";
import { Settings } from "./components/Settings.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthMiddleware />}>
            <Route path="/" element={<Login />} />
            <Route path="/log-in" element={<PasswordLogin />} />
            <Route path="/sign-up" element={<Signup />} />
            <Route path="/confirm-sign-up" element={<Otp />} />
            <Route path="/create-password" element={<CreatePassword />} />
            <Route path="/create-user" element={<CreateUser />} />
            <Route element={<Home />}>
              <Route path="/home" element={<HomeFeed />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/profile/:username/following" element={<UserConnections query="/follow/fetch-following" title="Following" />} />
              <Route path="/profile/:username/followers" element={<UserConnections query="/follow/fetch-followers" title="Followers" />} />
              <Route path="/post/:postId" element={<ExtendedFeedPost />} />
              <Route path="/reply/:replyId" element={<ExtendedReply />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="/messages" element={<ConversationHome />}>
              <Route index element={<MessagesHome />} />
              <Route path=":conversationId" element={<Messages />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster position="top-center" richColors />
    </Providers>
  </StrictMode>
);
