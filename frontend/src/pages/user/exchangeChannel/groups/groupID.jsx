import { useRouter } from "next/router";

export default function GroupDetail() {
  const router = useRouter();
  const { groupId } = router.query;

  const groupData = {
    "react-vietnam": { name: "React Vietnam", desc: "Cộng đồng React Việt Nam" },
    "frontend-devs": { name: "Frontend Devs", desc: "Nhóm lập trình frontend" },
  };

  const group = groupData[groupId];

  if (!group) return <p>Nhóm không tồn tại</p>;

  return (
    <div>
      <h1>{group.name}</h1>
      <p>{group.desc}</p>
    </div>
  );
}
