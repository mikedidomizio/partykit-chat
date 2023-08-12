import { useUsers } from "@/providers/Users/UsersProvider";
import { useMessage } from "@/providers/Message/MessageProvider";

export function WhoIsTyping() {
  const { usersWhoAreTyping } = useMessage();
  const { thisUser, users } = useUsers();
  const filteredOutThisUser = usersWhoAreTyping.filter(
    (user) => thisUser !== user,
  );

  const someoneTyping = filteredOutThisUser.length > 0;

  let textFormatted = null;

  if (someoneTyping) {
    textFormatted = filteredOutThisUser.reduce((acc, cur) => {
      if (acc !== "") {
        acc += ", ";
      }

      const foundUser = users.find((user) => user.id === cur);

      if (foundUser?.name) {
        acc += foundUser.name;
      } else {
        acc += cur;
      }

      return acc;
    }, "");

    if (filteredOutThisUser.length === 1) {
      textFormatted += " is typing";
    } else if (filteredOutThisUser.length > 1) {
      textFormatted += " are typing";
    }
  }

  return (
    <div className="h-[26.5px]">
      <div>
        {someoneTyping ? (
          <div className="loading loading-dots loading-sm top-1 relative mr-2" />
        ) : null}
        {textFormatted}
      </div>
    </div>
  );
}
