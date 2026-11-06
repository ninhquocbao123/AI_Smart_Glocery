import { Schema, models, model } from "mongoose";
const grant = new Schema(
  {
    userId: { type: String, index: true },
    plan: { type: String, enum: ["vip", "plus"] },
    startsAt: Date,
    endsAt: Date,
    source: String,
    reference: { type: String, unique: true },
    revokedAt: Date,
    actor: String,
    reason: String,
  },
  { timestamps: true },
);
export const Membership = models.Membership || model("Membership", grant);
export const Usage =
  models.MemberUsage ||
  model(
    "MemberUsage",
    new Schema({ _id: String, count: { type: Number, default: 0 } }),
  );
export const MealPlan =
  models.SavedMealPlan ||
  model(
    "SavedMealPlan",
    new Schema(
      {
        userId: { type: String, index: true },
        days: Number,
        servings: Number,
        budget: Number,
        meals: [Schema.Types.Mixed],
        shopping: [Schema.Types.Mixed],
        preferences: String,
        source: { type: String, enum: ["gemini", "catalog"] },
      },
      { timestamps: true },
    ),
  );
export const Pantry =
  models.PantryItem ||
  model(
    "PantryItem",
    new Schema(
      {
        userId: { type: String, index: true },
        name: String,
        quantity: Number,
        unit: String,
        expiresAt: String,
        location: String,
      },
      { timestamps: true },
    ),
  );
export const MemberAudit =
  models.MemberAudit ||
  model(
    "MemberAudit",
    new Schema(
      { userId: String, actor: String, action: String, reason: String },
      { timestamps: true },
    ),
  );
