
import ProductDetail from "@/components/nestable/ProductDetail"; // Import ProductDetail for product pages
import StoryblokStory from "@storyblok/react/story"; // Import StoryblokStory for general pages
import { notFound } from "next/navigation";
import { StoryblokCMS } from "@/utils/cms";

//Generates static paths for all stories
//Nextjs will generate a static page for each story
export async function generateStaticParams() {
  try {
    const paths = await StoryblokCMS.getStaticPaths();
    return paths;
  } catch (error) {
    console.log(error);
  }
}

//Generates static meta props for each story
export async function generateMetadata({ params }) {
  const slug = params.slug.join("/");
  return StoryblokCMS.generateMetaFromStory(slug);
}

//Params are passed to the CMSPage component and used to fetch the story
//This function is called for each item in the paths array returned from generateStaticParams func
export default async function CMSPage({ params }) {
  try {
    const currentStory = await StoryblokCMS.getStory(params);
    if (!currentStory) throw new Error();

    // Check if the content is a product or general page, and render accordingly
    if (currentStory.content.component === "productDetail") {
      // Render ProductDetail if the component is a product detail
      return <ProductDetail story={currentStory} />;
    } else {
      // Otherwise, render a general page
      return <StoryblokStory story={currentStory} />;
    }
  } catch (error) {
    notFound();
  }
}

//Force dynamic rendering in development and Visual editor
export const dynamic = StoryblokCMS.IS_DEV ? "force-dynamic" : "force-static";
