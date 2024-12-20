import UserCard from "@/components/cards/UserCard";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  console.log("user info", userInfo);

  if (!userInfo) return null;

  if (!userInfo?.onboarded) redirect("/onboarding");

  // fetch users
  const result = await fetchUsers({
    userId: user.id,
    searchString: "neel",
    pageNumber: 1,
    pageSize: 25,
  });

  console.log("results for profiles", result);

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>
      {/* search bar */}
      <div className="mt-14 flex flex-col gap-9">
        {result.users.length === 0 ? (
          <p className="no-result">No users found</p>
        ) : (
          <>
            {result.users.map((item) => {
              return (
                <UserCard
                  key={item.id}
                  id={item.id}
                  username={item.username}
                  name={item.name}
                  imgUrl={item.image}
                  personType="User"
                />
              );
            })}
          </>
        )}
      </div>
    </section>
  );
};

export default page;
