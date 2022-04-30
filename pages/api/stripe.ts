import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { IProduct } from "../../model";

type Data = {
  statusCode?: number;
  message?: string;
  session?: Stripe.Response<Stripe.Checkout.Session>;
};

const stripe = new Stripe(`${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}`, {
  apiVersion: "2020-08-27",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    try {
      const params: Stripe.Checkout.SessionCreateParams = {
        submit_type: "pay",
        mode: "payment",
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        shipping_options: [
          {
            shipping_rate: "shr_1Ku2CgH7wEerkfExOMiFgaOQ",
          },
          {
            shipping_rate: "shr_1Ku2GHH7wEerkfExwlJa9U3I",
          },
        ],
        line_items: req.body?.map((item: IProduct) => {
          const img = !!item?.image && item?.image[0]?.asset?._ref;
          const newImage = img
            .replace(
              "image-",
              "https://cdn.sanity.io/images/fjubuzye/production/"
            )
            .replace("-webp", ".webp");
          return {
            price_data: {
              currency: "idr",
              product_data: {
                name: item.name,
                images: [newImage],
              },
              unit_amount: (item?.price ?? 0) * 100,
            },
            adjustable_quantity: {
              enabled: true,
              minimum: 1,
            },
            quantity: item.quantity,
          };
        }),
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/canceled`,
      };

      const session = await stripe.checkout.sessions.create(params);
      res.status(200).json({ session });
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json({ message: err.message });
      }
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
