import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import Flip from "gsap/Flip";
import coin from '/packages/coin.svg';
gsap.registerPlugin(Flip);

// Dữ liệu ban đầu cho 10 backers
const initialBackers = [
  { id: 1, name: "Alice Johnson", avatar: "AJ", amount: 5000, color: "#FF6B6B" },
  { id: 2, name: "Bob Smith", avatar: "BS", amount: 4500, color: "#4ECDC4" },
  { id: 3, name: "Charlie Brown", avatar: "CB", amount: 3800, color: "#45B7D1" },
  { id: 4, name: "Diana Prince", avatar: "DP", amount: 3200, color: "#FFA07A" },
  { id: 5, name: "Evan Williams", avatar: "EW", amount: 2900, color: "#98D8C8" },
  { id: 6, name: "Fiona Green", avatar: "FG", amount: 2500, color: "#F7B731" },
  { id: 7, name: "George Miller", avatar: "GM", amount: 2100, color: "#5F27CD" },
  { id: 8, name: "Hannah Davis", avatar: "HD", amount: 1800, color: "#00B894" },
  { id: 9, name: "Ivan Petrov", avatar: "IP", amount: 1500, color: "#FF6348" },
  { id: 10, name: "Julia Anderson", avatar: "JA", amount: 1200, color: "#786FA6" },
];

/**
 * Leaderboard Component
 * Hiển thị top 10 backers với animation khi xếp hạng thay đổi
 */
const Leaderboard = () => {
  const [backers, setBackers] = useState(() =>
    [...initialBackers].sort((a, b) => b.amount - a.amount)
  );
  const listRef = useRef(null);
  const flipStateRef = useRef(null);

  // Animate khi "backers" thay đổi
  useLayoutEffect(() => {
    if (!flipStateRef.current) return;
    
    Flip.from(flipStateRef.current, {
      duration: 0.6,
      ease: "power2.inOut",
      stagger: 0.02,
      zIndex: (i, target) => {
        // Tăng z-index cho item đang di chuyển
        return 10;
      },
      onEnter: (targets) => {
        // Fade in cho item mới
        return gsap.from(targets, {
          opacity: 0,
          scale: 0.8,
        });
      },
    });
    
    flipStateRef.current = null;
  }, [backers]);

  // Mô phỏng thay đổi số tiền theo thời gian thực
  useEffect(() => {
    const timer = setInterval(() => {
      // 1) Chụp trạng thái hiện tại trước khi thay đổi
      flipStateRef.current = Flip.getState(
        listRef.current.querySelectorAll(".backer-row")
      );

      // 2) Cập nhật dữ liệu - cộng tiền ngẫu nhiên cho 1 backer
      setBackers((prev) => {
        const arr = [...prev];
        const randomIndex = Math.floor(Math.random() * arr.length);
        const deltaAmount = 100000 + Math.floor(Math.random() * 500000); // 100k - 600k VND
        
        // Cộng thêm tiền cho backer được chọn
        arr[randomIndex] = { 
          ...arr[randomIndex], 
          amount: arr[randomIndex].amount + deltaAmount 
        };
        
        // Sắp xếp lại theo số tiền giảm dần
        arr.sort((a, b) => b.amount - a.amount);
        
        return arr.slice(0, 10); // Đảm bảo chỉ hiển thị top 10
      });
    }, 2500); // Thay đổi mỗi 2.5 giây

    return () => clearInterval(timer);
  }, []);

  // Format số tiền VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  // Lấy medal emoji theo rank
  const getMedalEmoji = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-4xl">🏆</div>
          <h2 className="text-3xl font-bold text-text-primary dark:text-white">
            Top Backers
          </h2>
        </div>
        <p className="text-text-secondary dark:text-white/70">
          Những người ủng hộ hàng đầu cho dự án này
        </p>
      </div>

      {/* Leaderboard List */}
      <div className="bg-white dark:bg-darker-2 rounded-xl border border-border-light dark:border-white/10 overflow-hidden shadow-lg">
        <ul ref={listRef} className="divide-y divide-border-light dark:divide-white/10">
          {backers.map((backer, index) => {
            const rank = index + 1;
            const medal = getMedalEmoji(rank);
            const isTopThree = rank <= 3;

            return (
              <li
                key={backer.id}
                data-id={backer.id}
                className={`
                  backer-row flex items-center gap-4 p-3 transition-colors duration-200
                  ${isTopThree 
                    ? 'bg-gradient-to-r from-primary/5 to-transparent dark:from-primary/10' 
                    : 'hover:bg-background-lighter dark:hover:bg-darker-2-light'
                  }
                `}
              >
                {/* Rank Number */}
                <div className="flex items-center justify-center w-12 h-12">
                  {medal ? (
                    <span className="text-3xl">{medal}</span>
                  ) : (
                    <span className={`
                      text-2xl font-bold tabular-nums
                      ${isTopThree 
                        ? 'text-primary' 
                        : 'text-text-secondary dark:text-white/60'
                      }
                    `}>
                      #{rank}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <div 
                  className="flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-sm"
                  style={{ backgroundColor: backer.color }}
                >
                  {backer.avatar}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-text-primary dark:text-white truncate">
                    {backer.name}
                  </h3>
                  {isTopThree && (
                    <p className="text-xs text-primary font-medium">
                      Top Contributor
                    </p>
                  )}
                </div>

                {/* Amount */}
                <div className="text-right">
                  <div className="text-xl font-bold text-secondary tabular-nums">
                   {backer.amount} <img src={coin} alt="Coin" className="inline-block w-5 h-5 mb-0.5" />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;
