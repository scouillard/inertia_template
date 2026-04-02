import { PropsWithChildren } from 'react'
import Navbar from '@/components/navbar'
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function Layout({ children }: PropsWithChildren) {
  const { flash } = usePage()

  useEffect(() => {
      if (flash.notice) toast.success(flash.notice);
      if (flash.alert) toast.error(flash.alert);
  }, [flash]);

  return (
    <>
      <Navbar />
      <main className="pt-14">
        {children}
      </main>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
    </>
  )
}
