-- Enable UUID generation if not already enabled (Supabase usually has this)
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create ENUM types
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPPORT');
CREATE TYPE "CustomerType" AS ENUM ('INDIVIDUAL', 'BUSINESS');
CREATE TYPE "AddressType" AS ENUM ('SHIPPING', 'BILLING', 'BOTH');
CREATE TYPE "SubscriptionStatus" AS ENUM ('NONE', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'INCOMPLETE', 'INCOMPLETE_EXPIRED', 'TRIALING', 'UNPAID');
CREATE TYPE "PaymentMethodType" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'BANK_ACCOUNT');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED');
CREATE TYPE "PaymentType" AS ENUM ('CHARGE', 'REFUND', 'SUBSCRIPTION_CHARGE');
CREATE TYPE "IntegrationProvider" AS ENUM ('STRIPE', 'PAYPAL');
CREATE TYPE "IntegrationEventStatus" AS ENUM ('PROCESSED', 'FAILED', 'SKIPPED');
CREATE TYPE "SubscriptionInterval" AS ENUM ('MONTHLY', 'YEARLY');

-- Create function to update 'updatedAt' column
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create 'users' table
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationToken" TEXT,
    "emailVerificationExpiry" TIMESTAMP WITH TIME ZONE,
    "passwordResetToken" TEXT,
    "passwordResetExpiry" TIMESTAMP WITH TIME ZONE,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP WITH TIME ZONE,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "users_email_key" UNIQUE ("email")
);
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- Add trigger for 'updatedAt' on 'users'
CREATE TRIGGER set_users_timestamp
BEFORE UPDATE ON "public"."users"
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Create 'profiles' table
CREATE TABLE "public"."profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "customerType" "CustomerType" NOT NULL DEFAULT 'INDIVIDUAL',
    "taxIdentificationNumber" TEXT,
    "companyName" TEXT,
    "companyPosition" TEXT,
    "defaultShippingAddressId" UUID,
    "defaultBillingAddressId" UUID,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "profiles_userId_key" UNIQUE ("userId")
);
CREATE INDEX "profiles_userId_idx" ON "public"."profiles"("userId");
CREATE INDEX "profiles_phoneNumber_idx" ON "public"."profiles"("phoneNumber");

-- Add trigger for 'updatedAt' on 'profiles'
CREATE TRIGGER set_profiles_timestamp
BEFORE UPDATE ON "public"."profiles"
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Create 'addresses' table
CREATE TABLE "public"."addresses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "addressType" "AddressType" NOT NULL DEFAULT 'SHIPPING',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP WITH TIME ZONE,
    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "addresses_userId_idx" ON "public"."addresses"("userId");
CREATE INDEX "addresses_zipcode_idx" ON "public"."addresses"("zipcode");
CREATE INDEX "addresses_country_state_city_idx" ON "public"."addresses"("country", "state", "city");

-- Add trigger for 'updatedAt' on 'addresses'
CREATE TRIGGER set_addresses_timestamp
BEFORE UPDATE ON "public"."addresses"
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Create 'customer_payment_profiles' table
CREATE TABLE "public"."customer_payment_profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "defaultPaymentMethodId" TEXT, -- Assuming this refers to PaymentMethod.id which is UUID
    "metadata" JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "customer_payment_profiles_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "customer_payment_profiles_userId_key" UNIQUE ("userId"),
    CONSTRAINT "customer_payment_profiles_stripeCustomerId_key" UNIQUE ("stripeCustomerId")
);
CREATE INDEX "customer_payment_profiles_stripeCustomerId_idx" ON "public"."customer_payment_profiles"("stripeCustomerId");

-- Add trigger for 'updatedAt' on 'customer_payment_profiles'
CREATE TRIGGER set_customer_payment_profiles_timestamp
BEFORE UPDATE ON "public"."customer_payment_profiles"
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();


-- Create 'payment_methods' table
CREATE TABLE "public"."payment_methods" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "customerPaymentProfileId" UUID NOT NULL,
    "type" "PaymentMethodType" NOT NULL,
    "providerPaymentMethodId" TEXT NOT NULL,
    "billingAddressId" UUID,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "card_brand" TEXT,
    "last4" TEXT,
    "exp_month" INTEGER,
    "exp_year" INTEGER,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP WITH TIME ZONE,
    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "payment_methods_userId_idx" ON "public"."payment_methods"("userId");
CREATE INDEX "payment_methods_customerPaymentProfileId_idx" ON "public"."payment_methods"("customerPaymentProfileId");
CREATE INDEX "payment_methods_providerPaymentMethodId_idx" ON "public"."payment_methods"("providerPaymentMethodId");

-- Add trigger for 'updatedAt' on 'payment_methods'
CREATE TRIGGER set_payment_methods_timestamp
BEFORE UPDATE ON "public"."payment_methods"
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Create 'payment_transactions' table
CREATE TABLE "public"."payment_transactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "paymentMethodId" UUID NOT NULL,
    "type" "PaymentType" NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "stripePaymentIntentId" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "payment_transactions_userId_idx" ON "public"."payment_transactions"("userId");
CREATE INDEX "payment_transactions_paymentMethodId_idx" ON "public"."payment_transactions"("paymentMethodId");

-- Add trigger for 'updatedAt' on 'payment_transactions'
CREATE TRIGGER set_payment_transactions_timestamp
BEFORE UPDATE ON "public"."payment_transactions"
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Create 'IntegrationEvent' table
CREATE TABLE "public"."IntegrationEvent" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "provider" "IntegrationProvider" NOT NULL,
    "eventId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "status" "IntegrationEventStatus" NOT NULL DEFAULT 'PROCESSED',
    "error" TEXT,
    "processedAt" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "IntegrationEvent_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "IntegrationEvent_eventId_key" UNIQUE ("eventId")
);
CREATE INDEX "IntegrationEvent_provider_eventId_idx" ON "public"."IntegrationEvent"("provider", "eventId");

-- Create 'subscription_plans' table
CREATE TABLE "public"."subscription_plans" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "interval" "SubscriptionInterval" NOT NULL DEFAULT 'MONTHLY',
    "features" JSONB DEFAULT '{}',
    "stripeProductId" TEXT NOT NULL,
    "stripePriceId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP WITH TIME ZONE,
    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "subscription_plans_stripeProductId_key" UNIQUE ("stripeProductId"),
    CONSTRAINT "subscription_plans_stripePriceId_key" UNIQUE ("stripePriceId")
);
CREATE INDEX "subscription_plans_currency_idx" ON "public"."subscription_plans"("currency");
CREATE INDEX "subscription_plans_interval_idx" ON "public"."subscription_plans"("interval");

-- Add trigger for 'updatedAt' on 'subscription_plans'
CREATE TRIGGER set_subscription_plans_timestamp
BEFORE UPDATE ON "public"."subscription_plans"
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Create 'customer_subscriptions' table
CREATE TABLE "public"."customer_subscriptions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customerId" UUID NOT NULL,
    "planId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'NONE',
    "stripeSubscriptionId" TEXT NOT NULL,
    "currentPeriodStart" TIMESTAMP WITH TIME ZONE NOT NULL,
    "currentPeriodEnd" TIMESTAMP WITH TIME ZONE NOT NULL,
    "trialEndsAt" TIMESTAMP WITH TIME ZONE,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "canceledAt" TIMESTAMP WITH TIME ZONE,
    "lastPaymentError" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP WITH TIME ZONE,
    CONSTRAINT "customer_subscriptions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "customer_subscriptions_stripeSubscriptionId_key" UNIQUE ("stripeSubscriptionId")
);
CREATE INDEX "customer_subscriptions_customerId_idx" ON "public"."customer_subscriptions"("customerId");
CREATE INDEX "customer_subscriptions_planId_idx" ON "public"."customer_subscriptions"("planId");
CREATE INDEX "customer_subscriptions_status_idx" ON "public"."customer_subscriptions"("status");
CREATE INDEX "customer_subscriptions_currentPeriodEnd_idx" ON "public"."customer_subscriptions"("currentPeriodEnd");

-- Add trigger for 'updatedAt' on 'customer_subscriptions'
CREATE TRIGGER set_customer_subscriptions_timestamp
BEFORE UPDATE ON "public"."customer_subscriptions"
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Create 'processed_refunds' table
CREATE TABLE "public"."processed_refunds" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "idempotencyKey" TEXT NOT NULL,
    "transactionId" UUID NOT NULL,
    "amount" INTEGER,
    "status" "PaymentStatus" NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    CONSTRAINT "processed_refunds_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "processed_refunds_idempotencyKey_key" UNIQUE ("idempotencyKey")
);
CREATE INDEX "processed_refunds_idempotencyKey_idx" ON "public"."processed_refunds"("idempotencyKey");

-- Add trigger for 'updatedAt' on 'processed_refunds'
CREATE TRIGGER set_processed_refunds_timestamp
BEFORE UPDATE ON "public"."processed_refunds"
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Add Foreign Key Constraints

-- Profile <-> User
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Address <-> User
ALTER TABLE "public"."addresses" ADD CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Profile <-> Address (Default Shipping)
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_defaultShippingAddressId_fkey" FOREIGN KEY ("defaultShippingAddressId") REFERENCES "public"."addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Profile <-> Address (Default Billing)
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_defaultBillingAddressId_fkey" FOREIGN KEY ("defaultBillingAddressId") REFERENCES "public"."addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CustomerPaymentProfile <-> User
ALTER TABLE "public"."customer_payment_profiles" ADD CONSTRAINT "customer_payment_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- PaymentMethod <-> User
ALTER TABLE "public"."payment_methods" ADD CONSTRAINT "payment_methods_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- PaymentMethod <-> CustomerPaymentProfile
ALTER TABLE "public"."payment_methods" ADD CONSTRAINT "payment_methods_customerPaymentProfileId_fkey" FOREIGN KEY ("customerPaymentProfileId") REFERENCES "public"."customer_payment_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- PaymentMethod <-> Address (Billing Address)
ALTER TABLE "public"."payment_methods" ADD CONSTRAINT "payment_methods_billingAddressId_fkey" FOREIGN KEY ("billingAddressId") REFERENCES "public"."addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- PaymentTransaction <-> User
ALTER TABLE "public"."payment_transactions" ADD CONSTRAINT "payment_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE; -- Assuming RESTRICT as Prisma default when not specified

-- PaymentTransaction <-> PaymentMethod
ALTER TABLE "public"."payment_transactions" ADD CONSTRAINT "payment_transactions_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "public"."payment_methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE; -- Assuming RESTRICT

-- CustomerSubscription <-> CustomerPaymentProfile
ALTER TABLE "public"."customer_subscriptions" ADD CONSTRAINT "customer_subscriptions_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."customer_payment_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CustomerSubscription <-> SubscriptionPlan
ALTER TABLE "public"."customer_subscriptions" ADD CONSTRAINT "customer_subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ProcessedRefund <-> PaymentTransaction
ALTER TABLE "public"."processed_refunds" ADD CONSTRAINT "processed_refunds_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "public"."payment_transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE; -- Assuming RESTRICT
