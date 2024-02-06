import AppLayout from "@/Layouts/AppLayout";
import Tweet from "@/Components/Tweet";

type Props = {
    user: User;
    tweets_by: User;
    tweets: {
        data: any[];
    }
};

export default function Timeline(props: Props) {
    return (
        <AppLayout user={props.user}>
            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <p className="text-black text-lg font-semibold">
                    {props.tweets_by.name}'s Timeline
                </p>

                <div className="mt-6 bg-white shadow-sm rounded-lg divide-y">
                    {props.tweets.data.map((tweet) => (
                        <Tweet key={tweet.id} tweet={tweet} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
