import { PropsWithChildren } from 'react'
import Navbar from '@/components/navbar'
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function Layout({ children }: PropsWithChildren) {
  const { flash } = usePage()

  useEffect(() => {
      if (flash.notice) toast.success(flash.notice, { id: flash.notice });
      if (flash.alert) toast.error(flash.alert, { id: flash.alert });
  }, [flash.notice, flash.alert]);

  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-[calc(100svh-3.5rem)] pt-14">
        <div className="flex flex-col flex-1 px-4 py-6 sm:px-8 sm:py-12">
          {children}
        </div>
      </main>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{ duration: 6000 }}
      />
    </>
  )
}
