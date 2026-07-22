"use client";
import Image from "next/image";

const icons = [
  { name: "Home", svg: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12L12 3l9 9"/><path d="M9 21V9h6v12"/></svg>), section: "home" },
  { name: "Video", svg: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9l5 3-5 3V9z"/></svg>), section: "video" },
  { name: "Send", svg: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/></svg>), section: "send" },
  { name: "Search", svg: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>), section: "search" },
  { name: "Explore", svg: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M16 8l-2.5 7L8 16l2.5-7L16 8z"/></svg>), section: "explore" },
  { name: "Plus", svg: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>), section: "plus" },
  { name: "Stats", svg: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="13" width="4" height="8"/><rect x="9" y="9" width="4" height="12"/><rect x="15" y="5" width="4" height="16"/></svg>), section: "stats" },
  { name: "Profile", svg: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20v-1a8 8 0 0 1 16 0v1"/></svg>), section: "profile" },
  { name: "Menu", svg: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 8h16M4 16h16"/></svg>), section: "menu" },
];


import { useState, useRef } from "react";

function SectionContent({ section }: { section: string }) {
  // Notifications dynamiques (toasts)
  const [notifications, setNotifications] = useState<{ id: number, message: string }[]>([]);
  const notifId = useRef(0);
  function notify(message: string) {
    const id = ++notifId.current;
    setNotifications(n => [...n, { id, message }]);
    setTimeout(() => setNotifications(n => n.filter(notif => notif.id !== id)), 3500);
  }
  // Faux utilisateurs pour simulation
  const fakeUsers = [
    {
      name: "Kervens Jarbatt",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      handle: "@JarbattKe77147"
    },
    {
      name: "Ninaaa518",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      handle: "@Ninaaa518"
    },
    {
      name: "Litop Bau",
      avatar: "https://randomuser.me/api/portraits/men/44.jpg",
      handle: "@LitopBau"
    }
  ];
  const [currentUser, setCurrentUser] = useState(fakeUsers[0]);
  // Liste d'amis factices
  const friends = [
    {
      id: 1,
      name: "Shopping Bagg",
      avatar: "https://randomuser.me/api/portraits/men/11.jpg",
      last: "You: quiero mas informaciones · 2w"
    },
    {
      id: 2,
      name: "Biany",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      last: "You: 😊 · 2w"
    },
    {
      id: 3,
      name: "Rolls",
      avatar: "https://randomuser.me/api/portraits/men/33.jpg",
      last: "Not everyone can message this profile. · 3w"
    },
    {
      id: 4,
      name: "Instagram user",
      avatar: "https://randomuser.me/api/portraits/men/44.jpg",
      last: "You sent a photo. · 6w"
    },
    {
      id: 5,
      name: "Keleshop0",
      avatar: "https://randomuser.me/api/portraits/men/55.jpg",
      last: "Your note"
    }
  ];

  // Affichage des notifications (toasts) style Facebook
  // À placer en haut du return global de SectionContent :
  //
  // <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 items-end">
  //   {notifications.map(n => (
  //     <div
  //       key={n.id}
  //       className="relative flex items-center gap-3 px-5 py-4 rounded-2xl bg-white text-black shadow-xl border border-gray-200 animate-fb-toast"
  //       style={{ minWidth: 320, maxWidth: 400 }}
  //     >
  //       <span className="text-blue-500">
  //         <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><circle cx="12" cy="16" r="1.5"/></svg>
  //       </span>
  //       <span className="flex-1 text-base font-medium">{n.message}</span>
  //       <button
  //         className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 p-1 rounded-full"
  //         onClick={() => setNotifications(notifications => notifications.filter(notif => notif.id !== n.id))}
  //         aria-label="Fermer"
  //       >
  //         <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
  //       </button>
  //     </div>
  //   ))}
  // </div>
  //
  // À ajouter dans le CSS global ou local :
  // .animate-fb-toast {
  //   animation: fb-toast-in 0.4s cubic-bezier(.4,0,.2,1), fb-toast-out 0.4s cubic-bezier(.4,0,.2,1) 3.1s forwards;
  // }
  // @keyframes fb-toast-in {
  //   from { opacity: 0; transform: translateX(60px) scale(0.98); }
  //   to   { opacity: 1; transform: translateX(0) scale(1); }
  // }
  // @keyframes fb-toast-out {
  //   to { opacity: 0; transform: translateX(60px) scale(0.98); }
  // }
  function Feed() {
    const [posts, setPosts] = useState([
      {
        id: 1,
        user: fakeUsers[0],
        date: "Mar 23",
        text: "🇭🇹🇭🇹🇭🇹🇭🇹🇭🇹🇭🇹🇭🇹🇭🇹 haitian today hatian for ever",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
        video: ""
      },
      {
        id: 2,
        user: fakeUsers[0],
        date: "Mar 20",
        text: "Kindness costs nothing and will not affect your personality, be humble.",
        image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
        video: ""
      }
    ]);
    const [text, setText] = useState("");
    const [media, setMedia] = useState<{ url: string, type: "image" | "video" | null } | null>(null);

    const handleMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      if (file.type.startsWith("image/")) setMedia({ url, type: "image" });
      else if (file.type.startsWith("video/")) setMedia({ url, type: "video" });
    };

    const handlePost = (e: React.FormEvent) => {
      e.preventDefault();
      if (!text.trim() && !media) return;
      setPosts([
        {
          id: Date.now(),
          user: currentUser,
          date: new Date().toLocaleDateString(),
          text,
          image: media?.type === "image" ? media.url : "",
          video: media?.type === "video" ? media.url : ""
        },
        ...posts
      ]);
      setText("");
      setMedia(null);
    };

    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 mt-8 px-8 pb-16">
        {/* Sélecteur d’utilisateur simulé */}
        <div className="flex gap-2 mb-4 items-center">
          <span className="text-blue-200">Connecté en tant que :</span>
          {fakeUsers.map(u => (
            <button key={u.handle} onClick={() => setCurrentUser(u)} className={`flex items-center gap-2 px-3 py-1 rounded-full border ${currentUser.handle === u.handle ? 'bg-blue-700 text-white border-blue-700' : 'bg-blue-900 text-blue-200 border-blue-700 hover:bg-blue-800'}`}>
              <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full" />
              <span>{u.name}</span>
            </button>
          ))}
        </div>
        {/* Formulaire de création de post */}
        <form onSubmit={handlePost} className="bg-blue-900/80 rounded-2xl p-6 flex flex-col gap-3 shadow border border-blue-800 mb-6">
          <div className="flex gap-3 items-center">
            <img src={currentUser.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover border-2 border-blue-400" />
            <textarea
              className="flex-1 bg-blue-800/40 text-white rounded-lg p-3 outline-none resize-none min-h-[48px]"
              placeholder="Exprimez-vous..."
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </div>
          {media && (
            <div className="mt-2">
              {media.type === "image" ? (
                <img src={media.url} alt="aperçu" className="max-h-60 rounded-xl border border-blue-700" />
              ) : (
                <video src={media.url} controls className="max-h-60 rounded-xl border border-blue-700" />
              )}
            </div>
          )}
          <div className="flex gap-3 items-center mt-2">
            <label className="cursor-pointer text-blue-300 hover:text-blue-400">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/></svg>
              <input type="file" accept="image/*,video/*" className="hidden" onChange={handleMedia} />
            </label>
            <button type="submit" className="ml-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50" disabled={!text.trim() && !media}>Publier</button>
          </div>
        </form>
        {/* Affichage des posts */}
        {posts.map(post => (
          <div key={post.id} className="bg-blue-900/80 rounded-2xl p-6 flex flex-col gap-3 shadow border border-blue-800">
            <div className="flex gap-3 items-center">
              <img src={post.user.avatar} alt={post.user.name} className="w-12 h-12 rounded-full object-cover border-2 border-blue-400" />
              <div>
                <span className="font-bold text-white text-base">{post.user.name}</span>
                <span className="text-blue-200 ml-2">{post.user.handle}</span>
                <span className="text-blue-300 ml-2 text-sm">· {post.date}</span>
              </div>
            </div>
            <div className="text-white text-lg whitespace-pre-line">{post.text}</div>
            {post.image && (
              <img src={post.image} alt="post visuel" className="rounded-2xl w-full max-h-[500px] object-cover border border-blue-800 bg-black" />
            )}
            {post.video && (
              <video src={post.video} controls className="rounded-2xl w-full max-h-[500px] object-cover border border-blue-800 bg-black" />
            )}
          </div>
        ))}
      </div>
    );
  }
  if (section === "home") {
    return <Feed />;
  }
  switch (section) {
    case "video":
      // Composant mur de vidéos façon Reels/Facebook avec likes dynamiques
      function VideoWall() {
        const [videos, setVideos] = useState([
          {
            id: 1,
            url: "https://www.w3schools.com/html/mov_bbb.mp4",
            user: "Litop Bau",
            userPic: "https://randomuser.me/api/portraits/men/44.jpg",
            desc: "pour up",
            audio: "Litop Bau · Audio d'origine",
            likes: 7,
            comments: 0,
            shares: 0,
            liked: false
          }
        ]);

        const handleLike = (id: number) => {
          setVideos(videos => videos.map(v => v.id === id ? { ...v, liked: !v.liked, likes: v.liked ? v.likes - 1 : v.likes + 1 } : v));
        };

        return (
          <div className="flex flex-col items-center w-full min-h-[80vh] py-4">
            <div className="flex flex-col gap-8 w-full items-center">
              {videos.map(video => (
                <div key={video.id} className="flex flex-row justify-center w-full gap-4">
                  {/* Vidéo */}
                  <div className="relative rounded-2xl overflow-hidden shadow-lg bg-black" style={{ width: 370, height: 600 }}>
                    <video src={video.url} controls loop className="w-full h-full object-cover bg-black" />
                    {/* Overlay bas gauche : profil, nom, follow, audio, titre */}
                    <div className="absolute left-0 bottom-0 w-full flex flex-col gap-1 p-4 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-b-2xl">
                      <div className="flex items-center gap-2 mb-1">
                        <img src={video.userPic} alt={video.user} className="w-8 h-8 rounded-full border-2 border-white" />
                        <span className="text-white font-semibold text-sm">{video.user}</span>
                        <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded ml-2 cursor-pointer hover:bg-blue-500/80 transition">Suivre</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/80 text-xs">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/></svg>
                        <span>{video.audio}</span>
                      </div>
                      <div className="text-white font-bold text-base mt-1">{video.desc}</div>
                    </div>
                  </div>
                  {/* Colonne de boutons à droite, EN DEHORS de la vidéo */}
                  <div className="flex flex-col gap-6 items-center justify-center py-8">
                    <button className="flex flex-col items-center group">
                      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-white group-hover:text-blue-400"><path d="M6 21v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </button>
                    <button className="flex flex-col items-center group" onClick={() => handleLike(video.id)}>
                      <svg width="28" height="28" fill={video.liked ? "#ec4899" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={video.liked ? "text-pink-400" : "text-white group-hover:text-pink-400"}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
                      <span className="text-white text-xs">{video.likes}</span>
                    </button>
                    <button className="flex flex-col items-center group">
                      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-white group-hover:text-blue-400"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      <span className="text-white text-xs">{video.comments}</span>
                    </button>
                    <button className="flex flex-col items-center group">
                      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-white group-hover:text-green-400"><path d="M17 1l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/></svg>
                      <span className="text-white text-xs">{video.shares}</span>
                    </button>
                    <button className="flex flex-col items-center group">
                      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-white group-hover:text-white/60"><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="5" cy="12" r="2"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      return <VideoWall />;
    case "send":
      return (
        <div className="fixed left-[84px] top-0 h-screen w-[calc(100vw-84px)] bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex flex-col z-20">
          <div className="flex items-center justify-between px-8 pt-8 pb-4">
            <span className="text-3xl font-bold text-white">keleshop0</span>
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-blue-300"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/></svg>
          </div>
          <div className="flex gap-4 px-8 pb-4">
            <button className="font-semibold border-b-2 border-blue-400 text-white pb-1 px-4">Primary</button>
            <button className="text-white/60 pb-1 px-4">General</button>
            <button className="text-white/60 pb-1 px-4">Requests</button>
          </div>
          <div className="px-8 pb-4">
            <input className="w-full rounded-full bg-blue-950/60 px-4 py-3 text-white placeholder-white/60 outline-none border border-blue-700" placeholder="Search" />
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-8">
            {friends.map(friend => (
              <div key={friend.id} className="flex items-center gap-4 px-4 py-4 hover:bg-blue-800/60 cursor-pointer rounded-lg transition">
                <img src={friend.avatar} alt={friend.name} className="w-14 h-14 rounded-full object-cover border-2 border-blue-400" />
                <div className="flex flex-col">
                  <span className="font-semibold text-white text-lg">{friend.name}</span>
                  <span className="text-blue-200 text-sm">{friend.last}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case "search":
      return (
        <div className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex flex-col items-center">
          {/* Barre de recherche sticky */}
          <div className="w-full max-w-2xl sticky top-0 z-10 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 pt-4 pb-2 px-4">
            <div className="relative w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8899a6] pointer-events-none">
                <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><circle cx='11' cy='11' r='8'/><path d='M21 21l-4.35-4.35'/></svg>
              </span>
              <input
                className="w-full pl-12 pr-4 py-2 rounded-full bg-[#202327] text-white placeholder:text-[#8899a6] border border-transparent focus:border-blue-500 focus:bg-[#181c20] transition duration-150 shadow-none outline-none text-base"
                placeholder="Search "
                type="text"
                autoComplete="off"
                spellCheck="false"
              />
            </div>
          </div>
          {/* Onglets */}
          <div className="w-full max-w-2xl flex border-b border-blue-700 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 px-4">
            {['For You', 'Trending', 'News', 'Sports', 'Entertainment'].map((tab, idx) => (
              <button
                key={tab}
                className={`flex-1 py-3 text-center font-semibold relative transition-colors duration-150 
                  ${idx === 0 ? 'text-blue-400 border-b-4 border-blue-400 bg-blue-900/40' : 'text-blue-200 hover:bg-blue-800/40'}`}
                style={{ borderBottom: idx === 0 ? '4px solid #3b82f6' : '4px solid transparent' }}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Contenu exemple */}
          <div className="w-full max-w-2xl flex-1 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 px-4 py-4">
            <div className="bg-blue-800/80 rounded-2xl p-4 flex gap-4 items-start mb-4 border border-blue-700">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="avatar" className="w-12 h-12 rounded-full object-cover border-2 border-blue-400" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">N</span>
                  <span className="text-blue-200">@Ninaaa518 · May 4</span>
                </div>
                <div className="text-white mt-1 mb-2">Happy Monday</div>
                <video src="/videos/post1.mp4" controls className="rounded-2xl w-full max-w-md object-cover mb-2 border border-blue-700 bg-black" poster="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" />
                <div className="flex gap-8 text-blue-200 text-sm mt-2">
                  <span>48</span>
                  <span>183</span>
                  <span>8.4K</span>
                  <span>104K</span>
                </div>
              </div>
            </div>
            {/* Autres  fictifs ici si besoin */}
          </div>
        </div>
      );
    case "explore":
      return (
        <div className="fixed left-[84px] top-0 w-[calc(100vw-84px)] h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex flex-col items-center justify-center p-0 z-10">
          <div className="w-full h-full max-w-2xl mx-auto flex flex-col bg-blue-800/60 rounded-xl shadow-lg p-0 overflow-y-auto">
            {/* Onglets */}
            <div className="flex gap-2 px-6 pt-8 pb-2">
              {['Tout', 'Non lu', 'Mes publicités'].map((tab, idx) => (
                <button
                  key={tab}
                  className={`px-4 py-1 rounded-full font-semibold text-sm transition-all duration-150 
                    ${idx === 0 ? 'bg-blue-700 text-white' : 'bg-transparent text-blue-200 hover:bg-blue-800/60'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between px-6 pb-2 text-white/80 text-sm font-semibold">
              <span>Plus tôt</span>
              <button className="text-blue-300 hover:underline text-xs">Voir tout</button>
            </div>
            {/* Notifications */}
            <div className="flex-1 flex flex-col gap-1 px-2 pb-8 overflow-y-auto">
              {[
                {
                  id: 1,
                  user: 'Estheisy Marte',
                  avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
                  text: 'a accepté votre invitation.',
                  time: '1 j',
                  icon: 'user',
                  unread: true
                },
                {
                  id: 2,
                  user: 'Emily Santiago Castillo',
                  avatar: 'https://randomuser.me/api/portraits/women/46.jpg',
                  text: 'vous suit à présent.',
                  time: '1 j · Nexo Global',
                  icon: 'user',
                  unread: true
                },
                {
                  id: 3,
                  user: 'Jojo le Comédien et 2 autres personnes',
                  avatar: 'https://randomuser.me/api/portraits/men/47.jpg',
                  text: 'ces Creators similaires pourraient vous intéresser...',
                  time: '1 j',
                  icon: 'group',
                  unread: true
                },
                {
                  id: 4,
                  user: 'Thetesa Valentin',
                  avatar: 'https://randomuser.me/api/portraits/women/48.jpg',
                  text: 'a accepté votre invitation.',
                  time: '2 j',
                  icon: 'user',
                  unread: false
                },
                {
                  id: 5,
                  user: 'Nexo Global',
                  avatar: 'https://randomuser.me/api/portraits/men/49.jpg',
                  text: 'a 2 nouvelles vues.',
                  time: '2 j · Nexo Global',
                  icon: 'ads',
                  unread: true
                },
                {
                  id: 6,
                  user: 'Rood François',
                  avatar: 'https://randomuser.me/api/portraits/men/50.jpg',
                  text: 'a accepté votre invitation.',
                  time: '2 j',
                  icon: 'user',
                  unread: false
                }
              ].map(n => (
                <div key={n.id} className={`flex items-center gap-3 px-3 py-3 rounded-lg ${n.unread ? 'bg-blue-700/40' : 'bg-transparent'} hover:bg-blue-900/60 transition relative`}>
                  <img src={n.avatar} alt={n.user} className="w-11 h-11 rounded-full object-cover border-2 border-blue-400" />
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-white truncate block">{n.user}</span>
                    <span className="text-white/80 text-sm block truncate">{n.text}</span>
                    <span className="text-blue-300 text-xs block mt-0.5">{n.time}</span>
                  </div>
                  {/* Badge ou icône selon le type */}
                  {n.icon === 'user' && (
                    <span className="bg-blue-700 text-white rounded-full p-1"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M4 20v-1a8 8 0 0 1 16 0v1"/></svg></span>
                  )}
                  {n.icon === 'group' && (
                    <span className="bg-blue-700 text-white rounded-full p-1"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="7" r="4"/><circle cx="17" cy="7" r="4"/><path d="M17 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/></svg></span>
                  )}
                  {n.icon === 'ads' && (
                    <span className="bg-orange-500 text-white rounded-full p-1"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 9h8M8 13h6"/></svg></span>
                  )}
                  {n.unread && <span className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full"></span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case "plus":
      return <div className="text-2xl">Section Ajouter (à personnaliser)</div>;
    case "stats":
      return (
        <div className="flex w-full h-full min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800">
          {/* Sidebar */}
          <aside className="w-72 min-w-60 max-w-80 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 p-6 flex flex-col gap-2 text-white h-full">
            <h2 className="text-2xl font-bold mb-6">Tableau de bord<br />professionnel</h2>
            <nav className="flex flex-col gap-1 flex-1">
              <button className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-700 font-semibold text-base"><svg width='22' height='22' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M3 12L12 3l9 9'/><path d='M9 21V9h6v12'/></svg>Accueil</button>
              <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800/60 transition"><svg width='22' height='22' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><rect x='3' y='13' width='4' height='8'/><rect x='9' y='9' width='4' height='12'/><rect x='15' y='5' width='4' height='16'/></svg>Statistiques</button>
              <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800/60 transition"><svg width='22' height='22' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><rect x='3' y='5' width='18' height='14' rx='2'/><path d='M8 9h8M8 13h6'/></svg>Contenu</button>
              <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800/60 transition"><svg width='22' height='22' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M12 8V12'/><path d='M12 16h.01'/><circle cx='12' cy='12' r='10'/></svg>Monétisation</button>
              <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800/60 transition"><svg width='22' height='22' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M17 1l4 4-4 4'/><path d='M3 11v-1a4 4 0 0 1 4-4h14'/></svg>Engagement</button>
              <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800/60 transition"><svg width='22' height='22' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><rect x='3' y='3' width='18' height='18' rx='4'/><path d='M7 7h.01M12 7h.01M17 7h.01M7 12h.01M12 12h.01M17 12h.01M7 17h.01M12 17h.01M17 17h.01'/></svg>Tous les outils</button>
            </nav>
            <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg w-full">Créer une publication <span className='ml-1'>▼</span></button>
          </aside>
          {/* Main content */}
          <main className="flex-1 flex flex-col gap-6 p-8 bg-transparent">
            {/* Statut du profil */}
            <section className="bg-blue-900/80 rounded-2xl p-6 mb-4 text-white shadow border border-blue-800">
              <div className="flex items-center gap-4 mb-2">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" className="w-14 h-14 rounded-full object-cover border-2 border-blue-400" />
                <div>
                  <span className="font-bold text-lg">Jorgensen Kervens Jarbatt</span>
                  <div className="text-blue-200 text-sm">Le profil ne rencontre aucun problème. <a href="#" className="underline text-blue-300">En savoir plus</a></div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2"><svg width='20' height='20' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10'/><path d='M16 8l-2.5 7L8 16l2.5-7L16 8z'/></svg>Comptes associés</div>
                <div className="flex items-center gap-2"><svg width='20' height='20' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><rect x='3' y='5' width='18' height='14' rx='2'/><path d='M8 9h8M8 13h6'/></svg>Recommandation du profil</div>
                <div className="flex items-center gap-2"><svg width='20' height='20' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M17 1l4 4-4 4'/><path d='M3 11v-1a4 4 0 0 1 4-4h14'/></svg>Formation des Creators</div>
              </div>
            </section>
            {/* Progression hebdomadaire */}
            <section className="bg-blue-900/80 rounded-2xl p-6 text-white shadow border border-blue-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg">Votre progression hebdomadaire</span>
                <button className="text-blue-300 hover:underline text-sm">Voir tout</button>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-2 bg-blue-700 rounded-full overflow-hidden">
                  <div className="h-2 bg-blue-400 rounded-full w-1/12" style={{ width: '1%' }}></div>
                </div>
                <span className="text-blue-200 text-xs">Terminé à 1 %</span>
                <span className="text-blue-200 text-xs">Il reste 5 jours</span>
              </div>
              <ul className="divide-y divide-blue-800">
                <li className="py-3 flex items-center justify-between">
                  <span className="flex items-center gap-2"><svg width='20' height='20' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><rect x='3' y='3' width='18' height='18' rx='4'/><path d='M7 7h.01M12 7h.01M17 7h.01M7 12h.01M12 12h.01M17 12h.01M7 17h.01M12 17h.01M17 17h.01'/></svg>Créer 6 nouveaux reels publics</span>
                  <span className="text-blue-200 text-xs">0/6</span>
                </li>
                <li className="py-3 flex items-center justify-between">
                  <span className="flex items-center gap-2"><svg width='20' height='20' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10'/><path d='M16 8l-2.5 7L8 16l2.5-7L16 8z'/></svg>Obtenez 10 nouveaux followers</span>
                  <span className="text-blue-200 text-xs">0/10</span>
                </li>
                <li className="py-3 flex items-center justify-between">
                  <span className="flex items-center gap-2"><svg width='20' height='20' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><rect x='3' y='5' width='18' height='14' rx='2'/><path d='M8 9h8M8 13h6'/></svg>Obtenez encore 1000 vues sur votre contenu</span>
                  <span className="text-blue-200 text-xs">30/1000 terminés</span>
                </li>
              </ul>
            </section>
          </main>
        </div>
      );
    case "profile":
      return (
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex flex-col items-center">
          {/* Bannière */}
          <div className="w-full max-w-5xl h-64 bg-blue-900 relative flex items-end justify-end rounded-b-2xl overflow-hidden">
            <video src="/videos/cover.mp4" controls className="absolute inset-0 w-full h-full object-cover opacity-70 bg-black" poster="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" />
            <button className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 rounded-lg flex items-center gap-2 shadow font-semibold"><svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2'/><polyline points='7 9 12 4 17 9'/><line x1='12' y1='4' x2='12' y2='16'/></svg>Changer la photo de couverture</button>
          </div>
          {/* Avatar et infos */}
          <div className="w-full max-w-5xl flex items-end gap-6 px-8 -mt-16 relative z-10">
            <div className="w-36 h-36 rounded-full border-4 border-blue-900 bg-blue-800 overflow-hidden relative">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" className="w-full h-full object-cover" />
              <span className="absolute bottom-2 right-2 bg-black/70 rounded-full p-2"><svg width='20' height='20' fill='none' stroke='white' strokeWidth='2' viewBox='0 0 24 24'><path d='M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2'/><polyline points='7 9 12 4 17 9'/><line x1='12' y1='4' x2='12' y2='16'/></svg></span>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-white">Jorgensen Kervens Jarbatt</h1>
              <div className="text-blue-200 font-semibold">4 K followers · 693 suivi(e)s</div>
              <div className="text-white/80 text-base">don t hesitate</div>
              <div className="flex gap-4 mt-2">
                <span className="bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"><svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><rect x='3' y='13' width='4' height='8'/><rect x='9' y='9' width='4' height='12'/><rect x='15' y='5' width='4' height='16'/></svg>Tableau de bord</span>
                <button className="bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 border border-blue-700"><svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M12 20h9'/><path d='M16.5 3.5a2.121 2.121 0 1 1-3 3L7 13v4h4l6.5-6.5a2.121 2.121 0 0 0-3-3z'/></svg>Modifier</button>
              </div>
              <div className="flex gap-2 mt-2 text-blue-200 text-sm items-center">
                <span className="font-semibold">Création digitale</span>
                <span>@ keleshop0</span>
              </div>
            </div>
          </div>
          {/* Onglets */}
          <div className="w-full max-w-5xl flex gap-6 mt-8 border-b border-blue-800 px-8">
            {['Tout', 'À propos', 'Reels', 'Photos', 'Amis(es)', 'Plus'].map((tab, idx) => (
              <button key={tab} className={`py-3 px-2 font-semibold text-lg transition-all duration-150 ${idx === 0 ? 'text-blue-400 border-b-4 border-blue-400' : 'text-white/80 hover:text-blue-300'}`}>{tab}</button>
            ))}
          </div>
          {/* Section  style Twitter */}
          <div className="w-full max-w-3xl flex flex-col gap-6 mt-8 px-8 pb-16">
            {[
              {
                id: 1,
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                name: "Kervens Jarbatt",
                handle: "@JarbattKe77147",
                date: "Mar 23",
                text: "🇭🇹🇭🇹🇭🇹🇭🇹🇭🇹🇭🇹🇭🇹🇭🇹 haitian today hatian for ever",
                image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
              },
              {
                id: 2,
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                name: "Kervens Jarbatt",
                handle: "@JarbattKe77147",
                date: "Mar 20",
                text: "Kindness costs nothing and will not affect your personality, be humble.",
                image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80"
              }
            ].map(post => (
              <div key={post.id} className="bg-blue-900/80 rounded-2xl p-6 flex flex-col gap-3 shadow border border-blue-800">
                <div className="flex gap-3 items-center">
                  <img src={post.avatar} alt={post.name} className="w-12 h-12 rounded-full object-cover border-2 border-blue-400" />
                  <div>
                    <span className="font-bold text-white text-base">{post.name}</span>
                    <span className="text-blue-200 ml-2">{post.handle}</span>
                    <span className="text-blue-300 ml-2 text-sm">· {post.date}</span>
                  </div>
                </div>
                <div className="text-white text-lg whitespace-pre-line">{post.text}</div>
                {post.image && (
                  <video src={post.image ? post.image.replace(/\.jpg|\.jpeg|\.png|\.webp/, '.mp4') : undefined} controls className="rounded-2xl w-full max-h-[500px] object-cover border border-blue-800 bg-black" poster={post.image} />
                )}
              </div>
            ))}
          </div>
        </div>
      );
    case "menu":
      // Menu latéral style Twitter Settings
      const [selected, setSelected] = useState("Your account");
      const menuItems = [
        "Your account",
        "Monetization",
        "Premium",
        "Creator Subscriptions",
        "Security and account access",
        "Privacy and safety",
        "Notifications",
        "Accessibility, display, and languages",
        "Additional resources",
        "Help Center"
      ];
      const rightPanel: Record<string, React.ReactNode> = {
        "Your account": (
          <div>
            <h2 className="text-2xl font-bold mb-2 text-white">Your Account</h2>
            <p className="text-blue-200 mb-6">See information about your account, download an archive of your data, or learn about your account deactivation options</p>
            <div className="flex flex-col gap-4">
              <button className="flex items-center gap-3 p-4 rounded-lg hover:bg-blue-800/60 transition text-left">
                <span className="text-blue-400"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20v-1a8 8 0 0 1 16 0v1"/></svg></span>
                <span>
                  <span className="block font-semibold text-white">Account information</span>
                  <span className="block text-blue-200 text-sm">See your account information like your phone number and email address.</span>
                </span>
              </button>
              <button className="flex items-center gap-3 p-4 rounded-lg hover:bg-blue-800/60 transition text-left">
                <span className="text-blue-400"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 17v-6"/><path d="M9 10l3-3 3 3"/></svg></span>
                <span>
                  <span className="block font-semibold text-white">Change your password</span>
                  <span className="block text-blue-200 text-sm">Change your password at any time.</span>
                </span>
              </button>
              <button className="flex items-center gap-3 p-4 rounded-lg hover:bg-blue-800/60 transition text-left">
                <span className="text-blue-400"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v16h16"/><path d="M4 4l16 16"/></svg></span>
                <span>
                  <span className="block font-semibold text-white">Download an archive of your data</span>
                  <span className="block text-blue-200 text-sm">Get insights into the type of information stored for your account.</span>
                </span>
              </button>
              <button className="flex items-center gap-3 p-4 rounded-lg hover:bg-blue-800/60 transition text-left">
                <span className="text-blue-400"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></span>
                <span>
                  <span className="block font-semibold text-white">Deactivate your account</span>
                  <span className="block text-blue-200 text-sm">Find out how you can deactivate your account.</span>
                </span>
              </button>
            </div>
          </div>
        ),
        // Ajoute d'autres panneaux ici si besoin
      };
      return (
        <div className="flex w-full min-h-[70vh] bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 rounded-2xl shadow-lg border border-blue-800">
          {/* Sidebar */}
          <aside className="w-80 min-w-60 max-w-96 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 p-6 flex flex-col gap-2 text-white h-full border-r border-blue-800">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <input
              type="text"
              placeholder="Search Settings"
              className="mb-4 px-4 py-2 rounded-full bg-blue-950/60 text-white placeholder:text-blue-400 border border-blue-800 focus:border-blue-400 outline-none"
            />
            <nav className="flex flex-col gap-1 flex-1">
              {menuItems.map(item => (
                <button
                  key={item}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-base transition-all duration-150 ${selected === item ? 'bg-blue-700 text-white' : 'bg-transparent text-blue-200 hover:bg-blue-800/60'}`}
                  onClick={() => setSelected(item)}
                >
                  {item}
                </button>
              ))}
            </nav>
          </aside>
          {/* Main panel */}
          <main className="flex-1 flex flex-col gap-6 p-10 bg-transparent">
            {rightPanel[selected] ?? (
              <div>
                <h2 className="text-2xl font-bold mb-2 text-white">{selected}</h2>
                <p className="text-blue-200">No content for this section yet.</p>
              </div>
            )}
          </main>
        </div>
      );
    default:
      return null;
  }
}

// Fil d’actualité style 
type Post = {
  id: number;
  author: string;
  avatar: string;
  time: string;
  text: string;
  image: string | null;
  likes: number;
  comments: number;
  shares: number;
};



function Feed() {
  // Publications factices pour l’exemple
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Nina Dupont",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      time: "il y a 2 min",
      text: "Voici ma première publication sur ce réseau social ! 😎",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      likes: 12,
      comments: 3,
      shares: 1,
      liked: false
    },
    {
      id: 2,
      author: "Alex Martin",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      time: "il y a 10 min",
      text: "Incroyable coucher de soleil ce soir 🌅",
      image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
      likes: 34,
      comments: 7,
      shares: 4,
      liked: false
    },
    {
      id: 3,
      author: "Sophie Bernard",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      time: "il y a 1 h",
      text: "Nouveau projet en cours, hâte de vous montrer ça ! 🚀",
      image: null,
      likes: 8,
      comments: 1,
      shares: 0,
      liked: false
    }
  ]);

  // Like dynamique
  const handleLike = (id: number) => {
    setPosts(posts => posts.map(post =>
      post.id === id
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  // Commentaire dynamique (incrément fictif)
  const handleComment = (id: number) => {
    setPosts(posts => posts.map(post =>
      post.id === id
        ? { ...post, comments: post.comments + 1 }
        : post
    ));
  };

  // Partage dynamique (incrément fictif)
  const handleShare = (id: number) => {
    setPosts(posts => posts.map(post =>
      post.id === id
        ? { ...post, shares: post.shares + 1 }
        : post
    ));
  };

  return (
    <div className="w-full max-w-2xl mx-auto pt-0 flex flex-col gap-6">
      {/* Formulaire de création de publication */}
      <div className="bg-black/60 rounded-xl p-4 flex items-center gap-4 shadow border border-blue-900">
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" className="w-10 h-10 rounded-full object-cover border border-blue-400" />
        <input
          type="text"
          placeholder="Quoi de neuf, Jorgensen Kervens ?"
          className="flex-1 bg-black/30 text-white px-4 py-2 rounded-full outline-none border border-transparent focus:border-blue-500 transition"
          disabled
        />
        <div className="flex gap-2 ml-2">
          <button className="bg-pink-700 hover:bg-pink-600 text-white rounded-full w-9 h-9 flex items-center justify-center" title="Vidéo">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9l5 3-5 3V9z"/></svg>
          </button>
          <button className="bg-green-600 hover:bg-green-500 text-white rounded-full w-9 h-9 flex items-center justify-center" title="Image">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 13l3-3 4 4"/></svg>
          </button>
          <button className="bg-pink-700 hover:bg-pink-600 text-white rounded-full w-9 h-9 flex items-center justify-center" title="Reel">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M7 7h.01M12 7h.01M17 7h.01M7 12h.01M12 12h.01M17 12h.01M7 17h.01M12 17h.01M17 17h.01"/></svg>
          </button>
        </div>
      </div>
      {/* Fil d’actualité */}
      {posts.map((post) => (
        <div key={post.id} className="bg-white/10 rounded-xl p-4 shadow flex flex-col gap-2">
          <div className="flex gap-3 items-center mb-1">
            <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full border border-blue-400 object-cover" />
            <div>
              <span className="font-bold text-base">{post.author}</span>
              <div className="text-xs text-white/60">{post.time}</div>
            </div>
          </div>
          <div className="mb-1 text-base whitespace-pre-line">{post.text}</div>
          {post.image && (
            <video src={post.image ? post.image.replace(/\.jpg|\.jpeg|\.png|\.webp/, '.mp4') : undefined} controls className="rounded-lg w-full max-h-80 object-cover border border-blue-900 bg-black" poster={post.image} />
          )}
          <div className="flex gap-8 mt-2 text-white/70 text-sm">
            <button onClick={() => handleComment(post.id)} className="hover:text-blue-400 flex items-center gap-1"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>{post.comments}</button>
            <button onClick={() => handleShare(post.id)} className="hover:text-green-400 flex items-center gap-1"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 1l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/></svg>{post.shares}</button>
            <button onClick={() => handleLike(post.id)} className={`flex items-center gap-1 ${post.liked ? 'text-pink-400' : 'hover:text-pink-400'}`}><svg width="18" height="18" fill={post.liked ? '#ec4899' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>{post.likes}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ReseauSocial() {
  return <div className="min-h-screen bg-black" />;
}
