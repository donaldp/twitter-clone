import { InputError } from "@/Components/InputError";
import { useForm } from "@inertiajs/inertia-react";
import AppLayout from "@/Layouts/AppLayout";
import Tweet from "@/Components/Tweet";

type Props = {
    user: User;
    tweets: {
        data: any[];
    }
};

export default function Home(props: Props) {
    const { post, data, setData, errors, processing } = useForm({
        tweet: "",
    });

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        post("/tweet", {
            preserveScroll: true,
            onSuccess: () => setData("tweet", ""),
        });
    }

    return (
        <AppLayout user={props.user}>
            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                {props.user ? (
                    <form onSubmit={submit}>
                        <textarea
                            value={data.tweet}
                            placeholder="What's on your mind?"
                            className="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                            onChange={(e) => setData("tweet", e.target.value)}
                        ></textarea>
                        <InputError error={errors.tweet} />
                        <button
                            className="mt-4 bg-gray-700 text-white p-2 rounded-md"
                            disabled={processing}
                        >
                            Tweet
                        </button>
                    </form>
                ) : (
                    <p className="text-center mt-4 text-gray-600">
                        Please <a href="/login">login</a> to tweet.
                    </p>
                )}

                <div className="mt-6 bg-white shadow-sm rounded-lg divide-y">
                    {props.tweets.data.map((tweet) => (
                        <Tweet key={tweet.id} tweet={tweet} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
