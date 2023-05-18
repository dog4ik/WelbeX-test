import { prisma } from "../index";

function getRandomPassword() {
  return `mockPassword${Math.floor(Math.random() * 1000)}`;
}
export async function mockPosts(amount: number) {
  console.log("mocking posts");
  const users = await prisma.user.findMany({
    where: { id: { startsWith: "mockId" } },
  });
  let posts = [...Array(amount)].map((_, idx) => {
    let user = users[Math.floor(Math.random() * users.length)];
    return {
      message: `Mock post message ${idx}`,
      authorId: user.id,
    };
  });
  await prisma.post.createMany({ data: posts, skipDuplicates: true });
}
export async function mockUsers(amount: number) {
  await prisma.user.deleteMany({ where: { id: { startsWith: "mockId" } } });
  console.log("mocking users");
  let users = [...Array(amount)].map((_, idx) => {
    return {
      id: `mockId${idx + 1}`,
      username: `mockUser${idx + 1}`,
      password: getRandomPassword(),
    };
  });
  await prisma.user.createMany({ data: users, skipDuplicates: true });
}
